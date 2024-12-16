// toner.model.js

module.exports = (sequelize, DataTypes) => {
  const Toner = sequelize.define('toner', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      }
    },
    compatible: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Importante para identificação única do toner
      validate: {
        len: [1, 100],
      }
    },
    min_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      }
    },
    current_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      }
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'toners',
    indexes: [
      { fields: ['code'], unique: true }, // Índice único já garantido pelo unique:true, mas index torna mais explícito
      { fields: ['name'] }
    ]
  });

  return Toner;
};
