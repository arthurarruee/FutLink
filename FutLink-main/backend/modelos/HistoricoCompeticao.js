const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');

const HistoricoCompeticao = sequelize.define(
  'HistoricoCompeticao',
  {
    nomeCompeticao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ano: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clubeOuSelecao: {
      type: DataTypes.STRING, // por qual time/seleção disputou essa competição
      allowNull: true,
    },
    resultado: {
      type: DataTypes.ENUM('Participação', 'Campeão', 'Vice-campeão', 'Semifinalista', 'Outro'),
      allowNull: true,
    },
    descricao: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  },
  {
    tableName: 'HistoricosCompeticao',
  }
);

module.exports = HistoricoCompeticao;
