const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');

const Match = sequelize.define(
  'Match',
  {},
  {
    tableName: 'Matches',
    indexes: [{ unique: true, fields: ['atletaId', 'empresarioId'] }],
  }
);

module.exports = Match;
