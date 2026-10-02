const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');
const Usuario = sequelize.define('Usuario', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.ENUM('atleta', 'empresario'),
        allowNull: false,
    },
}, {
    tableName: 'Usuarios',
});
module.exports = Usuario;
