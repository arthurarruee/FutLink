const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');

const HistoricoClube = sequelize.define(
  'HistoricoClube',
  {
    nomeClube: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING, // ex: Sub-15, Sub-17, Sub-20, Profissional, Amador
      allowNull: true,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anoInicio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anoFim: {
      type: DataTypes.STRING, // pode ficar vazio/"Atual" se ainda joga lá
      allowNull: true,
    },
    descricao: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  },
  {
    tableName: 'HistoricosClube',
  }
);

module.exports = HistoricoClube;
