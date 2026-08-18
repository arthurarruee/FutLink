const Usuario = require('./Usuario');
const PerfilAtleta = require('./PerfilAtleta');
const PerfilEmpresario = require('./PerfilEmpresario');
const Portfolio = require('./Portfolio');
const Interesse = require('./Interesse');
const Match = require('./Match');
const Mensagem = require('./Mensagem');

Usuario.hasOne(PerfilAtleta, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
PerfilAtleta.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasOne(PerfilEmpresario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
PerfilEmpresario.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasMany(Portfolio, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Portfolio.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasMany(Interesse, { foreignKey: 'atletaId', as: 'InteressesRecebidos', onDelete: 'CASCADE' });
Usuario.hasMany(Interesse, { foreignKey: 'empresarioId', as: 'InteressesEnviados', onDelete: 'CASCADE' });
Interesse.belongsTo(Usuario, { foreignKey: 'atletaId', as: 'Atleta' });
Interesse.belongsTo(Usuario, { foreignKey: 'empresarioId', as: 'Empresario' });

Usuario.hasMany(Match, { foreignKey: 'atletaId', as: 'MatchesComoAtleta', onDelete: 'CASCADE' });
Usuario.hasMany(Match, { foreignKey: 'empresarioId', as: 'MatchesComoEmpresario', onDelete: 'CASCADE' });
Match.belongsTo(Usuario, { foreignKey: 'atletaId', as: 'Atleta' });
Match.belongsTo(Usuario, { foreignKey: 'empresarioId', as: 'Empresario' });

Usuario.hasMany(Mensagem, { foreignKey: 'remetenteId', as: 'MensagensEnviadas', onDelete: 'CASCADE' });
Usuario.hasMany(Mensagem, { foreignKey: 'destinatarioId', as: 'MensagensRecebidas', onDelete: 'CASCADE' });
Mensagem.belongsTo(Usuario, { foreignKey: 'remetenteId', as: 'Remetente' });
Mensagem.belongsTo(Usuario, { foreignKey: 'destinatarioId', as: 'Destinatario' });

module.exports = { Usuario, PerfilAtleta, PerfilEmpresario, Portfolio, Interesse, Match, Mensagem };
