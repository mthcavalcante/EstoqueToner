// models/printer.model.js
module.exports = (sequelize, DataTypes) => {
  const Printer = sequelize.define('printer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
  }, {
    timestamps: true,
    underscored: true,
  });
  return Printer;
};
