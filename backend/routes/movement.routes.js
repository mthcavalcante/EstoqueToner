// routes/movement.routes.js
module.exports = app => {
  const movements = require('../controllers/movement.controller.js');
  const router = require('express').Router();

  // Criar uma nova movimentação
  router.post('/', movements.create);

  // Recuperar todas as movimentações
  router.get('/', movements.findAll);

  // Recuperar uma única movimentação por id
  router.get('/:id', movements.findOne);

  // Atualizar uma movimentação por id
  router.put('/:id', movements.update);

  // Deletar uma movimentação por id
  router.delete('/:id', movements.delete);

  // Criar múltiplas entradas de toner
  router.post('/bulk-entry', movements.bulkCreateEntrada);

  router.post('/bulk-saida', movements.bulkCreateSaida);

  app.use('/api/movements', router);
};
