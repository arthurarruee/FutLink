const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracao/banco');

// Guarda arquivos enviados pelos usuários (foto de perfil e documento de comprovação).
//
// POR QUE NO BANCO E NÃO EM UMA PASTA DO SERVIDOR?
// No Render, o disco do servidor é "efêmero": a cada deploy/reinício ele é apagado, e as fotos
// sumiriam. O MySQL é permanente, então as imagens continuam lá depois de sair e entrar de novo.
// Também fica mais seguro: o arquivo só sai pela API, depois de checar quem está pedindo.
//
// Tabela NOVA ("Arquivos"): não altera nenhuma tabela existente, então os dados atuais ficam intactos.
const Arquivo = sequelize.define(
  'Arquivo',
  {
    categoria: {
      type: DataTypes.ENUM('foto', 'comprovacao'),
      allowNull: false,
    },
    nomeOriginal: { type: DataTypes.STRING, allowNull: true },
    mimeType: { type: DataTypes.STRING(50), allowNull: false },
    tamanho: { type: DataTypes.INTEGER, allowNull: false },
    conteudo: { type: DataTypes.BLOB('long'), allowNull: false },
  },
  {
    tableName: 'Arquivos',
    // Cada usuário tem no máximo 1 foto e 1 comprovação.
    indexes: [{ unique: true, fields: ['usuarioId', 'categoria'] }],
  }
);

module.exports = Arquivo;
