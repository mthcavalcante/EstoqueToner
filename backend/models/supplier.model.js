// models/supplier.model.js
module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('supplier', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    company_name: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING, allowNull: false },
    whatsapp: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
  }, {
    timestamps: true,
    underscored: true,
  });
  return Supplier;
};
