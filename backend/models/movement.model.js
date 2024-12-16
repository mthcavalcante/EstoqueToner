// models/movement.model.js

module.exports = (sequelize, DataTypes) => {
  const Movement = sequelize.define('movement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    toner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'toners',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      // Caso queira impedir deleção de toners em uso, 'RESTRICT' é adequado.
      // Caso queira permitir, mas deletar todas as movements associadas, use 'CASCADE'.
    },
    type: {
      type: DataTypes.ENUM('entrada', 'saida'),
      allowNull: false,
      validate: {
        isIn: [['entrada', 'saida']],
      }
    },
    technician: {
      type: DataTypes.STRING,
      allowNull: false,
      // Pode adicionar um limite de tamanho se quiser, por ex: len: [1, 100]
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
      // Poderia adicionar um limite de tamanho ex: len: [0, 255]
    },
    person_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    printer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'movements',
    // Caso queira, pode adicionar indexes:
    indexes: [
      { fields: ['toner_id'] },
      { fields: ['type'] },
      { fields: ['created_at'] },
    ]
  });

  return Movement;
};
