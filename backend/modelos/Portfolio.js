const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');

const Portfolio = sequelize.define(
  'Portfolio',
  {
    urlVideo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Portfolios',
  }
);

module.exports = Portfolio;
