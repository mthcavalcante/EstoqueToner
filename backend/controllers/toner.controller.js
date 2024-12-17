// controllers/toner.controller.js
const db = require('../models');
const Toner = db.toners;
const Printer = db.printers;

exports.create = async (req, res) => {
  try {
    const { name, compatible, code, min_level, current_stock } = req.body;

    if (!name || !compatible || !code) {
      return res.status(400).send({ message: 'Campos "name", "compatible" e "code" são obrigatórios.' });
    }

    const tonerData = { name, compatible, code, min_level: min_level || 0, current_stock: current_stock || 0 };
    const data = await Toner.create(tonerData);
    return res.send(data);
  } catch (err) {
    console.error('Erro ao criar toner:', err);
    return res.status(500).send({ message: err.message || 'Erro ao criar o toner.' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Toner.findAll();
    return res.send(data);
  } catch (err) {
    console.error('Erro ao recuperar toners:', err);
    return res.status(500).send({ message: err.message || 'Erro ao recuperar os toners.' });
  }
};

exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Toner.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: `Toner com id=${id} não encontrado.` });
    }
    return res.send(data);
  } catch (err) {
    console.error(`Erro ao recuperar toner com id=${id}:`, err);
    return res.status(500).send({ message: `Erro ao recuperar o toner com id=${id}.` });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [num] = await Toner.update(req.body, { where: { id: id } });
    if (num === 1) {
      return res.send({ message: 'Toner atualizado com sucesso.' });
    } else {
      return res.send({ message: `Não foi possível atualizar o toner com id=${id}.` });
    }
  } catch (err) {
    console.error(`Erro ao atualizar toner com id=${id}:`, err);
    return res.status(500).send({ message: `Erro ao atualizar o toner com id=${id}.` });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const num = await Toner.destroy({ where: { id: id } });
    if (num === 1) {
      return res.send({ message: 'Toner deletado com sucesso!' });
    } else {
      return res.send({ message: `Não foi possível deletar o toner com id=${id}. Talvez ele não exista.` });
    }
  } catch (err) {
    console.error(`Erro ao deletar toner com id=${id}:`, err);
    return res.status(500).send({ message: `Erro ao deletar o toner com id=${id}.` });
  }
};

// Associação de impressoras ao toner
exports.addPrinterToToner = async (req, res) => {
  const { toner_id, printer_id } = req.params;
  try {
    const toner = await Toner.findByPk(toner_id);
    const printer = await Printer.findByPk(printer_id);
    if (!toner || !printer) return res.status(404).send({ message: 'Toner ou Impressora não encontrada.' });
    await toner.addAvailable_printer(printer);
    return res.send({ message: 'Impressora associada ao toner com sucesso.' });
  } catch (error) {
    return res.status(500).send({ message: 'Erro ao associar impressora ao toner.' });
  }
};

exports.removePrinterFromToner = async (req, res) => {
  const { toner_id, printer_id } = req.params;
  try {
    const toner = await Toner.findByPk(toner_id);
    const printer = await Printer.findByPk(printer_id);
    if (!toner || !printer) return res.status(404).send({ message: 'Toner ou Impressora não encontrada.' });
    await toner.removeAvailable_printer(printer);
    return res.send({ message: 'Impressora removida do toner com sucesso.' });
  } catch (error) {
    return res.status(500).send({ message: 'Erro ao remover impressora do toner.' });
  }
};

exports.getAvailablePrinters = async (req, res) => {
  const { id } = req.params;
  try {
    const toner = await Toner.findByPk(id, {
      include: {
        model: db.printers,
        as: 'available_printers',
        through: { attributes: [] }
      }
    });
    if (!toner) return res.status(404).send({ message: 'Toner não encontrado.' });
    return res.send(toner.available_printers);
  } catch (error) {
    return res.status(500).send({ message: 'Erro ao obter impressoras disponíveis para o toner.' });
  }
};
