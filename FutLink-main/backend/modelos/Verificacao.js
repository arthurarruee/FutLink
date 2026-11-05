const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');

// Situação da "Comprovação Profissional" de um empresário.
// Enviar o documento NUNCA aprova sozinho: o status nasce como "pendente" e só um
// administrador pode mudar para "aprovado" ou "recusado".
const Verificacao = sequelize.define(
  'Verificacao',
  {
    status: {
      type: DataTypes.ENUM('pendente', 'aprovado', 'recusado'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    motivoRecusa: { type: DataTypes.STRING(300), allowNull: true },
    analisadoPorId: { type: DataTypes.INTEGER, allowNull: true },
    analisadoEm: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'Verificacoes',
    indexes: [{ unique: true, fields: ['usuarioId'] }],
  }
);

module.exports = Verificacao;
