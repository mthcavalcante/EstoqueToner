// supplier.model.js

module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('supplier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      }
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      }
    },
    whatsapp: {
      type: DataTypes.STRING,
      allowNull: true,
      // Poderia validar um padrão de número de telefone/whatsapp se necessário
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'suppliers',
    indexes: [
      { fields: ['company_name'] }
    ]
  });

  return Supplier;
};
