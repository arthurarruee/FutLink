const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');
const PerfilEmpresario = sequelize.define('PerfilEmpresario', {
    empresa: { type: DataTypes.STRING, allowNull: true },
    cargo: { type: DataTypes.STRING, allowNull: true },
    cidade: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.STRING, allowNull: true },
    biografia: { type: DataTypes.STRING(500), allowNull: true },
    fotoPerfil: { type: DataTypes.STRING, allowNull: true },
}, {
    tableName: 'PerfilEmpresarios',
});
module.exports = PerfilEmpresario;
