// toner.controller.js

const db = require('../models');
const Toner = db.toners;

/**
 * Cria e salva um novo toner.
 * É obrigatório fornecer "name", "compatible" e "code".
 */
exports.create = async (req, res) => {
  try {
    const { name, compatible, code, min_level, current_stock } = req.body;

    // Validar campos obrigatórios
    if (!name || !compatible || !code) {
      return res.status(400).send({
        message: 'Campos "name", "compatible" e "code" são obrigatórios.',
      });
    }

    // Criar objeto toner
    const tonerData = {
      name,
      compatible,
      code,
      min_level: min_level || 0,
      current_stock: current_stock || 0,
    };

    // Salvar o toner no banco de dados
    const data = await Toner.create(tonerData);
    return res.send(data);
  } catch (err) {
    console.error('Erro ao criar toner:', err);
    return res.status(500).send({
      message: err.message || 'Ocorreu um erro ao criar o toner.',
    });
  }
};

/**
 * Retorna todos os toners do banco de dados.
 */
exports.findAll = async (req, res) => {
  try {
    const data = await Toner.findAll();
    return res.send(data);
  } catch (err) {
    console.error('Erro ao recuperar toners:', err);
    return res.status(500).send({
      message: err.message || 'Ocorreu um erro ao recuperar os toners.',
    });
  }
};

/**
 * Retorna um único toner com base no id fornecido.
 */
exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Toner.findByPk(id);
    if (!data) {
      return res.status(404).send({
        message: `Toner com id=${id} não encontrado.`,
      });
    }
    return res.send(data);
  } catch (err) {
    console.error(`Erro ao recuperar toner com id=${id}:`, err);
    return res.status(500).send({
      message: `Erro ao recuperar o toner com id=${id}.`,
    });
  }
};

/**
 * Atualiza um toner pelo id.
 * O corpo da requisição (req.body) pode conter qualquer campo atualizável do toner.
 */
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [num] = await Toner.update(req.body, {
      where: { id: id },
    });

    if (num === 1) {
      return res.send({ message: 'Toner atualizado com sucesso.' });
    } else {
      return res.send({
        message: `Não foi possível atualizar o toner com id=${id}. Verifique se o toner existe ou se os campos fornecidos estão corretos.`,
      });
    }
  } catch (err) {
    console.error(`Erro ao atualizar toner com id=${id}:`, err);
    return res.status(500).send({
      message: `Erro ao atualizar o toner com id=${id}.`,
    });
  }
};

/**
 * Deleta um toner pelo id.
 */
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const num = await Toner.destroy({
      where: { id: id },
    });

    if (num === 1) {
      return res.send({
        message: 'Toner deletado com sucesso!',
      });
    } else {
      return res.send({
        message: `Não foi possível deletar o toner com id=${id}. Talvez ele não exista.`,
      });
    }
  } catch (err) {
    console.error(`Erro ao deletar toner com id=${id}:`, err);
    return res.status(500).send({
      message: `Não foi possível deletar o toner com id=${id}.`,
    });
  }
};
