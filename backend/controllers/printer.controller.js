// controllers/printer.controller.js
const db = require('../models');
const Printer = db.printers;

exports.create = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name) {
      return res.status(400).send({ message: 'Campo "name" é obrigatório.' });
    }
    const printer = await Printer.create({ name, location: location || '' });
    return res.send(printer);
  } catch (err) {
    console.error('Erro ao criar impressora:', err);
    return res.status(500).send({ message: 'Erro ao criar impressora.' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const printers = await Printer.findAll();
    return res.send(printers);
  } catch (err) {
    console.error('Erro ao recuperar impressoras:', err);
    return res.status(500).send({ message: 'Erro ao recuperar impressoras.' });
  }
};

exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const printer = await Printer.findByPk(id);
    if (!printer) {
      return res.status(404).send({ message: `Impressora com id=${id} não encontrada.` });
    }
    return res.send(printer);
  } catch (err) {
    console.error(`Erro ao recuperar impressora com id=${id}:`, err);
    return res.status(500).send({ message: `Erro ao recuperar a impressora com id=${id}.` });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [num] = await Printer.update(req.body, { where: { id: id } });
    if (num === 1) {
      return res.send({ message: 'Impressora atualizada com sucesso.' });
    } else {
      return res.send({ message: `Não foi possível atualizar a impressora com id=${id}.` });
    }
  } catch (err) {
    console.error(`Erro ao atualizar impressora com id=${id}:`, err);
    return res.status(500).send({ message: `Erro ao atualizar a impressora com id=${id}.` });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const num = await Printer.destroy({ where: { id: id } });
    if (num === 1) {
      return res.send({ message: 'Impressora deletada com sucesso!' });
    } else {
      return res.send({ message: `Não foi possível deletar a impressora com id=${id}. Talvez ela não exista.` });
    }
  } catch (err) {
    console.error(`Erro ao deletar impressora com id=${id}:`, err);
    return res.status(500).send({ message: `Erro ao deletar a impressora com id=${id}.` });
  }
};

exports.getCompatibleToners = async (req, res) => {
  const { id } = req.params;
  try {
    const printer = await Printer.findByPk(id, {
      include: {
        model: db.toners,
        as: 'compatible_toners',
        through: { attributes: [] }
      }
    });
    if (!printer) return res.status(404).send({ message: 'Impressora não encontrada.' });
    return res.send(printer.compatible_toners);
  } catch (error) {
    return res.status(500).send({ message: 'Erro ao obter toners compatíveis para a impressora.' });
  }
};
