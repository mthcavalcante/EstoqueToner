// supplier.controller.js

const db = require('../models');
const Supplier = db.suppliers;

/**
 * Cria e salva um novo fornecedor.
 * É obrigatório fornecer "company_name" e "contact".
 */
exports.create = async (req, res) => {
  try {
    const { company_name, contact, whatsapp, address } = req.body;

    // Validar a requisição
    if (!company_name || !contact) {
      return res.status(400).send({
        message: 'Campos "company_name" e "contact" são obrigatórios.',
      });
    }

    // Criar um objeto fornecedor
    const supplier = {
      company_name,
      contact,
      whatsapp: whatsapp || '',
      address: address || '',
    };

    // Salvar o fornecedor no banco de dados
    const data = await Supplier.create(supplier);
    return res.send(data);
  } catch (err) {
    console.error('Erro ao criar fornecedor:', err);
    return res.status(500).send({
      message: err.message || 'Ocorreu um erro ao criar o fornecedor.',
    });
  }
};

/**
 * Retorna todos os fornecedores do banco de dados.
 */
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

/**
 * Retorna um único fornecedor com base no id fornecido.
 */
exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Supplier.findByPk(id);
    if (!data) {
      return res.status(404).send({
        message: `Fornecedor com id=${id} não encontrado.`,
      });
    }
    return res.send(data);
  } catch (err) {
    console.error(`Erro ao recuperar fornecedor com id=${id}:`, err);
    return res.status(500).send({
      message: `Erro ao recuperar o fornecedor com id=${id}.`,
    });
  }
};

/**
 * Atualiza um fornecedor pelo id.
 * O corpo da requisição (req.body) pode conter qualquer campo atualizável do fornecedor.
 */
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [num] = await Supplier.update(req.body, {
      where: { id: id },
    });

    if (num === 1) {
      return res.send({
        message: 'Fornecedor atualizado com sucesso.',
      });
    } else {
      return res.send({
        message: `Não foi possível atualizar o fornecedor com id=${id}. Verifique se o fornecedor existe ou se os campos fornecidos estão corretos.`,
      });
    }
  } catch (err) {
    console.error(`Erro ao atualizar fornecedor com id=${id}:`, err);
    return res.status(500).send({
      message: `Erro ao atualizar o fornecedor com id=${id}.`,
    });
  }
};

/**
 * Deleta um fornecedor pelo id.
 */
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const num = await Supplier.destroy({
      where: { id: id },
    });

    if (num === 1) {
      return res.send({
        message: 'Fornecedor deletado com sucesso!',
      });
    } else {
      return res.send({
        message: `Não foi possível deletar o fornecedor com id=${id}. Talvez ele não exista.`,
      });
    }
  } catch (err) {
    console.error(`Erro ao deletar fornecedor com id=${id}:`, err);
    return res.status(500).send({
      message: `Não foi possível deletar o fornecedor com id=${id}.`,
    });
  }
};
