// toner.routes.js
module.exports = app => {
  const toners = require('../controllers/toner.controller.js');
  const router = require('express').Router();

  router.post('/', toners.create);
  router.get('/', toners.findAll);
  router.get('/:id', toners.findOne);
  router.put('/:id', toners.update);
  router.delete('/:id', toners.delete);

  // Rotas para associação de impressoras ao toner
  router.post('/:toner_id/printers/:printer_id', toners.addPrinterToToner);
  router.delete('/:toner_id/printers/:printer_id', toners.removePrinterFromToner);
  router.get('/:id/available-printers', toners.getAvailablePrinters);

  app.use('/api/toners', router);
};
