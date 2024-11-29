const { Sequelize } = require('sequelize');

// Conexão com o banco de dados
const sequelize = new Sequelize('toner_db', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;