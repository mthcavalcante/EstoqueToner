// movement.controller.js

const db = require('../models');
const Movement = db.movements;
const Toner = db.toners;

/**
 * Cria e salva uma nova movimentação.
 * Valida a requisição, garante que o toner exista e que há estoque suficiente se for uma saída.
 */
exports.create = async (req, res) => {
  try {
    const { type, technician, toner_id, quantity, reason, person_name, printer } = req.body;

    // Validação dos campos obrigatórios
    if (!type || !technician || !toner_id || !quantity) {
      return res.status(400).send({
        message: 'Conteúdo inválido: "type", "technician", "toner_id" e "quantity" são obrigatórios.',
      });
    }

    // Validar o tipo de movimentação
    if (!['entrada', 'saida'].includes(type)) {
      return res.status(400).send({
        message: 'Tipo de movimentação inválido! Use "entrada" ou "saida".',
      });
    }

    // Validar a quantidade
    if (quantity <= 0) {
      return res.status(400).send({
        message: 'A quantidade deve ser maior que zero!',
      });
    }

    // Verificar se o toner existe
    const toner = await Toner.findByPk(toner_id);
    if (!toner) {
      return res.status(404).send({
        message: `Toner com id=${toner_id} não encontrado.`,
      });
    }

    // Verificar estoque se for saída
    if (type === 'saida' && toner.current_stock < quantity) {
      return res.status(400).send({
        message: 'Estoque insuficiente para esta movimentação.',
      });
    }

    // Atualizar o estoque do toner
    if (type === 'saida') {
      toner.current_stock -= quantity;
    } else if (type === 'entrada') {
      toner.current_stock += quantity;
    }
    await toner.save();

    // Criar a movimentação
    const movement = {
      toner_id: toner_id,
      type: type,
      technician: technician,
      quantity: quantity,
      reason: reason || '',
      person_name: person_name || null,
      printer: printer || null,
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

/**
 * Retorna todas as movimentações do banco de dados, incluindo o toner associado, ordenadas pela data de criação.
 */
exports.findAll = async (req, res) => {
  try {
    const data = await Movement.findAll({
      include: [
        {
          model: db.toners,
          as: 'toner',
          attributes: ['name'],
        },
      ],
      order: [['created_at', 'DESC']], // Garante a ordenação pelas datas mais recentes primeiro
    });
    return res.send(data);
  } catch (err) {
    console.error('Erro ao recuperar movimentações:', err);
    return res.status(500).send({
      message: 'Erro ao recuperar as movimentações.',
    });
  }
};

/**
 * Retorna uma única movimentação com base no id.
 */
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
      message: 'Erro ao recuperar a movimentação solicitada.',
    });
  }
};

/**
 * Atualiza uma movimentação pelo id.
 * Caso o tipo ou quantidade mudem, atualiza o estoque do toner associado.
 */
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

    // Se tipo ou quantidade foram alterados, ajustar o estoque
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

/**
 * Deleta uma movimentação pelo id.
 * Reverte a alteração no estoque do toner antes de deletar.
 */
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

    // Reverter a movimentação antes de deletar
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
      return res.send({
        message: 'Movimentação deletada com sucesso!',
      });
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
