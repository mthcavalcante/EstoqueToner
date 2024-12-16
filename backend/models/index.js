// index.js

const { Sequelize } = require('sequelize');

// Ajuste as credenciais e o host conforme necessário.
// Considere usar variáveis de ambiente para segurança.
const sequelize = new Sequelize('postgres', 'postgres', 'senha123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Desabilita logs do SQL no console, pode habilitar se precisar debugar
  define: {schema: 'estoque_toner'}
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importação das models
db.toners = require('./toner.model')(sequelize, Sequelize);
db.suppliers = require('./supplier.model')(sequelize, Sequelize);
db.movements = require('./movement.model')(sequelize, Sequelize);

// Definição das Relações
db.toners.hasMany(db.movements, { foreignKey: 'toner_id', as: 'movements' });
db.movements.belongsTo(db.toners, { foreignKey: 'toner_id', as: 'toner' });

// Caso futuro: se quiser relacionar suppliers com toner ou movements, pode-se adicionar relações aqui.

module.exports = db;
