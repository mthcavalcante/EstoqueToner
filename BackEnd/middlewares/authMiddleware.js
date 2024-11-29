const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acesso negado' });

    try {
        const decoded = jwt.verify(token, 'secret'); // Substitua 'secret' por uma chave mais segura
        req.user = await User.findByPk(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

const authorize = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ error: 'Permissão negada' });
    }
    next();
};

module.exports = { authenticate, authorize };