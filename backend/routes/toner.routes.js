// toner.routes.js

module.exports = app => {
  const toners = require('../controllers/toner.controller.js');
  const router = require('express').Router();

  // Criar um novo toner
  router.post('/', toners.create);

  // Recuperar todos os toners
  router.get('/', toners.findAll);

  // Recuperar um único toner por id
  router.get('/:id', toners.findOne);

  // Atualizar um toner por id
  router.put('/:id', toners.update);

  // Deletar um toner por id
  router.delete('/:id', toners.delete);

  app.use('/api/toners', router);
};
