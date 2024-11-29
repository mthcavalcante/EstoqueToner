const express = require('express');
const tonerController = require('../controllers/tonerController');

const router = express.Router();

// Rotas
router.post('/toner', tonerController.addToner); // Adicionar toner
router.get('/toners', tonerController.getTonners); // Listar todos os toners
router.put('/toner/:id', tonerController.updateToner); // Atualizar toner

module.exports = router;