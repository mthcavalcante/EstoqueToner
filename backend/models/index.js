// models/index.js
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
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
