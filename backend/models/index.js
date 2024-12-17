// models/index.js
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'senha123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Desabilita logs do SQL no console, pode habilitar se precisar debugar
  define: {schema: 'estoque_toner'}
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.toners = require('./toner.model')(sequelize, DataTypes);
db.suppliers = require('./supplier.model')(sequelize, DataTypes);
db.printers = require('./printer.model')(sequelize, DataTypes);
db.movements = require('./movement.model')(sequelize, DataTypes);
db.printer_toners = require('./printer_toners.model')(sequelize, DataTypes);

// Relações
db.toners.hasMany(db.movements, { foreignKey: 'toner_id', as: 'movements' });
db.movements.belongsTo(db.toners, { foreignKey: 'toner_id', as: 'toner' });

db.printers.hasMany(db.movements, { foreignKey: 'printer_id', as: 'movements' });
db.movements.belongsTo(db.printers, { foreignKey: 'printer_id', as: 'printer' });

db.toners.belongsToMany(db.printers, { through: db.printer_toners, foreignKey: 'toner_id', otherKey: 'printer_id', as: 'available_printers' });
db.printers.belongsToMany(db.toners, { through: db.printer_toners, foreignKey: 'printer_id', otherKey: 'toner_id', as: 'compatible_toners' });

module.exports = db;
