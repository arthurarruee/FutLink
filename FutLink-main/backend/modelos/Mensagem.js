const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');

const Mensagem = sequelize.define(
  'Mensagem',
  {
    conteudo: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  },
  {
    tableName: 'Mensagens',
  }
);

module.exports = Mensagem;
