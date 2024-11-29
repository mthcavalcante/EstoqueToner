const express = require('express');
const tonerController = require('../controllers/tonerController');

const router = express.Router();

// Rotas
router.post('/toner', tonerController.addToner);
router.get('/toners', tonerController.getTonners);
router.put('/toner/:id', tonerController.updateToner);

module.exports = router;