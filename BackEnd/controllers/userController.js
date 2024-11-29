const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Criar usuário (Admin apenas)
exports.createUser = async (req, res) => {
    const { fullName, email, password, role } = req.body;

    try {
        // Gerar username baseado no nome completo
        const username = fullName
            .toLowerCase()
            .replace(/ /g, '.') // Substitui espaços por "."
            .replace(/[^a-z.]/g, ''); // Remove caracteres inválidos

        // Verifica se o username já existe
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username já existe. Tente outro nome.' });
        }

        // Criptografar senha
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Criar usuário
        const newUser = await User.create({
            username,
            fullName,
            email,
            password: hashedPassword,
            role: role || 'normal',
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
};
// Listar usuários (Admin apenas)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'fullName', 'email', 'role'],
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar usuários.' });
    }
};
