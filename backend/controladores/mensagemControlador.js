const { Op } = require('sequelize');
const { Usuario, Mensagem, Match } = require('../modelos');

const existeMatchEntre = async (usuarioAId, usuarioBId) => {
  const usuarioA = await Usuario.findByPk(usuarioAId);
  const usuarioB = await Usuario.findByPk(usuarioBId);
  if (!usuarioA || !usuarioB) return false;

  const atletaId = usuarioA.tipo === 'atleta' ? usuarioA.id : usuarioB.id;
  const empresarioId = usuarioA.tipo === 'empresario' ? usuarioA.id : usuarioB.id;

  const match = await Match.findOne({ where: { atletaId, empresarioId } });
  return Boolean(match);
};

const enviarMensagem = async (req, res) => {
  try {
    const { destinatarioId, conteudo } = req.body;
    if (!destinatarioId || !conteudo) {
      return res.status(400).json({ mensagem: 'Informe o destinatário e o conteúdo da mensagem.' });
    }

    const podeConversar = await existeMatchEntre(req.usuario.id, destinatarioId);
    if (!podeConversar) {
      return res.status(403).json({ mensagem: 'Vocês precisam ter um match antes de conversar.' });
    }

    const mensagem = await Mensagem.create({
      remetenteId: req.usuario.id,
      destinatarioId,
      conteudo,
    });

    res.status(201).json(mensagem);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao enviar mensagem.', erro: erro.message });
  }
};

const listarConversa = async (req, res) => {
  const outroUsuarioId = req.params.usuarioId;

  const podeConversar = await existeMatchEntre(req.usuario.id, outroUsuarioId);
  if (!podeConversar) {
    return res.status(403).json({ mensagem: 'Vocês precisam ter um match antes de conversar.' });
  }

  const mensagens = await Mensagem.findAll({
    where: {
      [Op.or]: [
        { remetenteId: req.usuario.id, destinatarioId: outroUsuarioId },
        { remetenteId: outroUsuarioId, destinatarioId: req.usuario.id },
      ],
    },
    order: [['createdAt', 'ASC']],
  });

  res.json(mensagens);
};

const excluirMensagem = async (req, res) => {
  const mensagem = await Mensagem.findOne({ where: { id: req.params.id, remetenteId: req.usuario.id } });
  if (!mensagem) {
    return res.status(404).json({ mensagem: 'Mensagem não encontrada.' });
  }
  await mensagem.destroy();
  res.json({ mensagem: 'Mensagem excluída.' });
};

module.exports = { enviarMensagem, listarConversa, excluirMensagem };
