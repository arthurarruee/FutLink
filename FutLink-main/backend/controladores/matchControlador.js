const { Usuario, PerfilAtleta, PerfilEmpresario, Match, Verificacao } = require('../modelos');

const incluirSelo = { model: Verificacao, attributes: ['status'], where: { status: 'aprovado' }, required: false };

const listarMeusMatches = async (req, res) => {
  const ehAtleta = req.usuario.tipo === 'atleta';

  const matches = await Match.findAll({
    where: ehAtleta ? { atletaId: req.usuario.id } : { empresarioId: req.usuario.id },
    include: [
      {
        model: Usuario,
        as: ehAtleta ? 'Empresario' : 'Atleta',
        attributes: ['id', 'nome', 'email'],
        include: ehAtleta ? [PerfilEmpresario, incluirSelo] : [PerfilAtleta],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.json(matches);
};

module.exports = { listarMeusMatches };
