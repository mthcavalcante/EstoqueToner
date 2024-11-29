const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Toner = require('./Toner');
const User = require('./User');

const History = sequelize.define('History', {
    action: { type: DataTypes.ENUM('entrada', 'saida'), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
});

History.belongsTo(Toner);
History.belongsTo(User);

module.exports = History;