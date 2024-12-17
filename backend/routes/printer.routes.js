// routes/printer.routes.js
module.exports = app => {
  const printers = require('../controllers/printer.controller.js');
  const router = require('express').Router();

  // CRUD de impressoras
  router.post('/', printers.create);
  router.get('/', printers.findAll);
  router.get('/:id', printers.findOne);
  router.put('/:id', printers.update);
  router.delete('/:id', printers.delete);

  // Rota para obter toners compatíveis com uma impressora
  router.get('/:id/compatible-toners', printers.getCompatibleToners);

  app.use('/api/printers', router);
};
