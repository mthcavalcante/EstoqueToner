// models/toner.model.js
module.exports = (sequelize, DataTypes) => {
  const Toner = sequelize.define('toner', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    compatible: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    min_level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    current_stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, {
    timestamps: true,
    underscored: true,
  });
  return Toner;
};
