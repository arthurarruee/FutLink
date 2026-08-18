const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');
const PerfilAtleta = sequelize.define('PerfilAtleta', {
    idade: { type: DataTypes.INTEGER, allowNull: true },
    posicao: { type: DataTypes.STRING, allowNull: true },
    pePreferido: { type: DataTypes.ENUM('Direito', 'Esquerdo', 'Ambidestro'), allowNull: true },
    clubeAtual: { type: DataTypes.STRING, allowNull: true },
    cidade: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.STRING, allowNull: true },
    biografia: { type: DataTypes.STRING(500), allowNull: true },
    fotoPerfil: { type: DataTypes.STRING, allowNull: true },
}, {
    tableName: 'PerfilAtletas',
});
module.exports = PerfilAtleta;
