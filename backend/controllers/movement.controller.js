// controllers/movement.controller.js

const db = require('../models');
const Movement = db.movements;
const Toner = db.toners;
const Printer = db.printers; // caso precise verificar impressora

// Criar e salvar uma nova movimentação
exports.create = async (req, res) => {
  try {
    const { type, technician, toner_id, quantity, reason, person_name, printer_id } = req.body;

    if (!type || !technician || !toner_id || !quantity) {
      return res.status(400).send({
        message: 'Campos "type", "technician", "toner_id" e "quantity" são obrigatórios.',
      });
    }

    if (!['entrada', 'saida'].includes(type)) {
      return res.status(400).send({
        message: 'Tipo de movimentação inválido! Use "entrada" ou "saida".',
      });
    }

    if (quantity <= 0) {
      return res.status(400).send({
        message: 'A quantidade deve ser maior que zero!',
      });
    }

    const toner = await Toner.findByPk(toner_id);
    if (!toner) {
      return res.status(404).send({
        message: `Toner com id=${toner_id} não encontrado.`,
      });
    }

    // Se for saida, verifica estoque
    if (type === 'saida' && toner.current_stock < quantity) {
      return res.status(400).send({
        message: 'Estoque insuficiente para esta movimentação.',
      });
    }

    // Verifica impressora se fornecida
    let printerInstance = null;
    if (type === 'saida' && printer_id) {
      printerInstance = await Printer.findByPk(printer_id);
      if (!printerInstance) {
        return res.status(404).send({
          message: `Impressora com id=${printer_id} não encontrada.`,
        });
      }
    }

    // Atualizar estoque
    if (type === 'saida') {
      toner.current_stock -= quantity;
    } else if (type === 'entrada') {
      toner.current_stock += quantity;
    }
    await toner.save();

    const movement = {
      toner_id: toner_id,
      type: type,
      technician: technician,
      quantity: quantity,
      reason: reason || '',
      person_name: person_name || null,
      printer_id: type === 'saida' ? printer_id || null : null,
    };

    const data = await Movement.create(movement);
    return res.send(data);
  } catch (err) {
    console.error('Erro ao criar a movimentação:', err);
    return res.status(500).send({
      message: 'Ocorreu um erro ao criar a movimentação.',
    });
  }
};

// Recuperar todas as movimentações
exports.findAll = async (req, res) => {
  try {
    const data = await Movement.findAll({
      include: [
        {
          model: db.toners,
          as: 'toner',
          attributes: ['name'],
        },
        {
          model: db.printers,
          as: 'printer',
          attributes: ['name'],
        }
      ],
      order: [['created_at', 'DESC']],
    });
    return res.send(data);
  } catch (err) {
    console.error('Erro ao recuperar movimentações:', err);
    return res.status(500).send({
      message: 'Erro ao recuperar as movimentações.',
    });
  }
};

// Recuperar uma única movimentação por id
exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Movement.findByPk(id, {
      include: [
        {
          model: db.toners,
          as: 'toner',
          attributes: ['name'],
        },
        {
          model: db.printers,
          as: 'printer',
          attributes: ['name'],
        }
      ],
    });
    if (!data) {
      return res.status(404).send({
        message: `Movimentação com id=${id} não encontrada.`,
      });
    }
    return res.send(data);
  } catch (err) {
    console.error(`Erro ao recuperar movimentação com id=${id}:`, err);
    return res.status(500).send({
      message: `Erro ao recuperar a movimentação com id=${id}.`,
    });
  }
};

// Atualizar uma movimentação por id
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const movement = await Movement.findByPk(id);
    if (!movement) {
      return res.status(404).send({
        message: `Movimentação com id=${id} não encontrada.`,
      });
    }

    const { type, quantity } = req.body;

    if (type || quantity) {
      const originalType = movement.type;
      const originalQuantity = movement.quantity;
      const newType = type || originalType;
      const newQuantity = quantity || originalQuantity;

      const toner = await Toner.findByPk(movement.toner_id);
      if (!toner) {
        return res.status(404).send({
          message: `Toner com id=${movement.toner_id} não encontrado.`,
        });
      }

      // Reverter a movimentação original
      if (originalType === 'saida') {
        toner.current_stock += originalQuantity;
      } else if (originalType === 'entrada') {
        toner.current_stock -= originalQuantity;
      }

      // Aplicar a nova movimentação
      if (newType === 'saida') {
        if (toner.current_stock < newQuantity) {
          return res.status(400).send({
            message: 'Estoque insuficiente para esta movimentação.',
          });
        }
        toner.current_stock -= newQuantity;
      } else if (newType === 'entrada') {
        toner.current_stock += newQuantity;
      }

      await toner.save();
    }

    const [num] = await Movement.update(req.body, {
      where: { id: id },
    });

    if (num === 1) {
      return res.send({ message: 'Movimentação atualizada com sucesso.' });
    } else {
      return res.send({
        message: `Não foi possível atualizar a movimentação com id=${id}. Verifique se a movimentação existe ou se os campos fornecidos estão corretos.`,
      });
    }
  } catch (err) {
    console.error(`Erro ao atualizar movimentação com id=${id}:`, err);
    return res.status(500).send({
      message: `Erro ao atualizar a movimentação com id=${id}.`,
    });
  }
};

// Deletar uma movimentação com id
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const movement = await Movement.findByPk(id);
    if (!movement) {
      return res.status(404).send({
        message: `Movimentação com id=${id} não encontrada.`,
      });
    }

    const toner = await Toner.findByPk(movement.toner_id);
    if (!toner) {
      return res.status(404).send({
        message: `Toner com id=${movement.toner_id} não encontrado.`,
      });
    }

    // Reverter a movimentação
    if (movement.type === 'saida') {
      toner.current_stock += movement.quantity;
    } else if (movement.type === 'entrada') {
      toner.current_stock -= movement.quantity;
    }
    await toner.save();

    const num = await Movement.destroy({
      where: { id: id },
    });

    if (num === 1) {
      return res.send({ message: 'Movimentação deletada com sucesso!' });
    } else {
      return res.send({
        message: `Não foi possível deletar a movimentação com id=${id}. Talvez ela não exista.`,
      });
    }
  } catch (err) {
    console.error(`Erro ao deletar movimentação com id=${id}:`, err);
    return res.status(500).send({
      message: `Erro ao deletar a movimentação com id=${id}.`,
    });
  }
};

// Bulk Create de entradas
exports.bulkCreateEntrada = async (req, res) => {
  const entries = req.body;
  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).send({ message: 'Envie um array de movimentações.' });
  }

  const movementsToCreate = [];
  const t = await db.sequelize.transaction();
  try {
    for (const entry of entries) {
      const { toner_id, quantity, technician, reason } = entry;

      if (!toner_id || !quantity || !technician) {
        throw new Error('Cada entrada deve ter toner_id, quantity e technician.');
      }

      const toner = await Toner.findByPk(toner_id, { transaction: t });
      if (!toner) {
        throw new Error(`Toner com id=${toner_id} não encontrado.`);
      }

      if (quantity <= 0) {
        throw new Error('Quantidade deve ser maior que zero.');
      }

      // Atualizar estoque
      toner.current_stock += quantity;
      await toner.save({ transaction: t });

      movementsToCreate.push({
        toner_id,
        type: 'entrada',
        technician,
        quantity,
        reason: reason || '',
        person_name: null,
        printer_id: null
      });
    }

    const createdMovements = await db.movements.bulkCreate(movementsToCreate, { transaction: t });
    await t.commit();
    return res.send(createdMovements);
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: err.message });
  }
};

exports.bulkCreateSaida = async (req, res) => {
  const entries = req.body;
  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).send({ message: 'Envie um array de movimentações.' });
  }

  const movementsToCreate = [];
  const t = await db.sequelize.transaction();
  try {
    for (const entry of entries) {
      const { toner_id, quantity, technician, reason, printer_id } = entry;
      if (!toner_id || !quantity || !technician || !printer_id) {
        throw new Error('Cada saída deve ter toner_id, quantity, technician e printer_id.');
      }

      const toner = await db.toners.findByPk(toner_id, { transaction: t });
      if (!toner) throw new Error(`Toner com id=${toner_id} não encontrado.`);
      if (toner.current_stock < quantity) throw new Error(`Estoque insuficiente para o toner id=${toner_id}.`);

      toner.current_stock -= quantity;
      await toner.save({ transaction: t });

      movementsToCreate.push({
        toner_id,
        type: 'saida',
        technician,
        quantity,
        reason: reason || '',
        person_name: '',
        printer_id
      });
    }

    const createdMovements = await db.movements.bulkCreate(movementsToCreate, { transaction: t });
    await t.commit();
    return res.send(createdMovements);
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ message: err.message });
  }
};
