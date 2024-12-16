// supplier.routes.js

module.exports = app => {
  const suppliers = require('../controllers/supplier.controller.js');
  const router = require('express').Router();

  // Criar um novo fornecedor
  router.post('/', suppliers.create);

  // Recuperar todos os fornecedores
  router.get('/', suppliers.findAll);

  // Recuperar um único fornecedor por id
  router.get('/:id', suppliers.findOne);

  // Atualizar um fornecedor por id
  router.put('/:id', suppliers.update);

  // Deletar um fornecedor por id
  router.delete('/:id', suppliers.delete);

  app.use('/api/suppliers', router);
};
