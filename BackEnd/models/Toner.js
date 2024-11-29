const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Toner = sequelize.define('Toner', {
    nome: { type: DataTypes.STRING, allowNull: false },
    modelo: { type: DataTypes.STRING, allowNull: false },
    limite_minimo: { type: DataTypes.INTEGER, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Toner;