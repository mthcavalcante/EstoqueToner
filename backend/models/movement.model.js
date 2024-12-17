// models/movement.model.js
module.exports = (sequelize, DataTypes) => {
  const Movement = sequelize.define('movement', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    toner_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: { model: 'toners', key: 'id' },
      onUpdate: 'CASCADE', onDelete: 'RESTRICT'
    },
    type: { type: DataTypes.ENUM('entrada', 'saida'), allowNull: false },
    technician: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    reason: { type: DataTypes.STRING, allowNull: true },
    person_name: { type: DataTypes.STRING, allowNull: true },
    printer_id: {
      type: DataTypes.INTEGER, allowNull: true,
      references: { model: 'printers', key: 'id' },
      onUpdate: 'CASCADE', onDelete: 'SET NULL'
    },
  }, {
    timestamps: true,
    underscored: true,
  });
  return Movement;
};
