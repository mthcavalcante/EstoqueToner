const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { recordHistory, getHistory } = require('../controllers/historyController');

const router = express.Router();

// Obter histórico de movimentações
router.get('/', authenticate, getHistory);

// Registrar movimentação
router.post('/', authenticate, recordHistory);

module.exports = router;