const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { login, createUser, getUsers } = require('../controllers/userController');

const router = express.Router();

// Login
router.post('/login', login);

// Criar usuário
router.post('/', authenticate, authorize('admin'), createUser);

// Listar usuários
router.get('/', authenticate, authorize('admin'), getUsers);

module.exports = router;