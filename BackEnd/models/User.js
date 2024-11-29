const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: { // nome.sobrenome gerado automaticamente
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    fullName: { // Nome completo
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: { // Papel do usuário
        type: DataTypes.ENUM('admin', 'normal'),
        defaultValue: 'normal'
    }
});

module.exports = User;