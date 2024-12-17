// models/printer_toners.model.js
module.exports = (sequelize, DataTypes) => {
  const PrinterToners = sequelize.define('printer_toners', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    toner_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: { model: 'toners', key: 'id' },
      onUpdate: 'CASCADE', onDelete: 'CASCADE'
    },
    printer_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: { model: 'printers', key: 'id' },
      onUpdate: 'CASCADE', onDelete: 'CASCADE'
    }
  }, {
    timestamps: false,
    underscored: true,
  });
  return PrinterToners;
};
