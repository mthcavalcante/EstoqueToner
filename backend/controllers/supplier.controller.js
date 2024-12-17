// controllers/supplier.controller.js

const db = require('../models');
const Supplier = db.suppliers;

// Criar um novo fornecedor
exports.create = async (req, res) => {
  try {
    const { company_name, contact, whatsapp, address } = req.body;

    if (!company_name || !contact) {
      return res.status(400).send({
        message: 'Campos "company_name" e "contact" são obrigatórios.',
      });
    }

    const supplier = { company_name, contact, whatsapp: whatsapp || '', address: address || '' };
    const data = await Supplier.create(supplier);
    return res.send(data);
  } catch (err) {
    console.error('Erro ao criar fornecedor:', err);
    return res.status(500).send({
      message: err.message || 'Ocorreu um erro ao criar o fornecedor.',
    });
  }
};

// Recuperar todos os fornecedores
exports.findAll = async (req, res) => {
  try {
    const data = await Supplier.findAll();
    return res.send(data);
  } catch (err) {
    console.error('Erro ao recuperar fornecedores:', err);
    return res.status(500).send({
      message: err.message || 'Ocorreu um erro ao recuperar os fornecedores.',
    });
  }
};

// Recuperar um fornecedor por id
exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Supplier.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: `Fornecedor com id=${id} não encontrado.` });
    }
    return res.send(data);
  } catch (err) {
    console.error(`Erro ao recuperar fornecedor com id=${id}:`, err);
    return res.status(500).send({
      message: `Erro ao recuperar o fornecedor com id=${id}.`,
    });
  }
};

// Atualizar um fornecedor por id
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [num] = await Supplier.update(req.body, {
      where: { id: id },
    });
    if (num === 1) {
      return res.send({ message: 'Fornecedor atualizado com sucesso.' });
    } else {
      return res.send({
        message: `Não foi possível atualizar o fornecedor com id=${id}.`,
      });
    }
  } catch (err) {
    console.error(`Erro ao atualizar fornecedor com id=${id}:`, err);
    return res.status(500).send({
      message: `Erro ao atualizar o fornecedor com id=${id}.`,
    });
  }
};

// Deletar um fornecedor por id
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const num = await Supplier.destroy({
      where: { id: id },
    });
    if (num === 1) {
      return res.send({ message: 'Fornecedor deletado com sucesso!' });
    } else {
      return res.send({
        message: `Não foi possível deletar o fornecedor com id=${id}. Talvez ele não exista.`,
      });
    }
  } catch (err) {
    console.error(`Erro ao deletar fornecedor com id=${id}:`, err);
    return res.status(500).send({
      message: `Erro ao deletar o fornecedor com id=${id}.`,
    });
  }
};
