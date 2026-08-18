const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');

const Interesse = sequelize.define(
  'Interesse',
  {
    status: {
      type: DataTypes.ENUM('pendente', 'aceito', 'recusado'),
      allowNull: false,
      defaultValue: 'pendente',
    },
  },
  {
    tableName: 'Interesses',
    indexes: [{ unique: true, fields: ['atletaId', 'empresarioId'] }],
  }
);

module.exports = Interesse;
