const { Portfolio } = require('../modelos');
const { limparTexto, ehLinkYoutubeValido } = require('../utilitarios/validacao');

const adicionarVideo = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'atleta') {
      return res.status(403).json({ mensagem: 'Só atletas podem adicionar vídeos ao portfólio.' });
    }

    const urlVideo = limparTexto(req.body.urlVideo);
    const titulo = limparTexto(req.body.titulo);
    if (!urlVideo) {
      return res.status(400).json({ mensagem: 'Informe a URL do vídeo do YouTube.' });
    }
    if (!ehLinkYoutubeValido(urlVideo)) {
      return res.status(400).json({ mensagem: 'Cole um link válido de vídeo do YouTube.' });
    }
    if ((titulo && titulo.length > 255) || urlVideo.length > 255) {
      return res.status(400).json({ mensagem: 'Título ou link longo demais (máximo 255 caracteres).' });
    }

    const video = await Portfolio.create({ usuarioId: req.usuario.id, urlVideo, titulo });
    res.status(201).json({ mensagem: 'Vídeo adicionado ao portfólio!', video });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao adicionar vídeo.' });
  }
};

const editarVideo = async (req, res) => {
  try {
    const video = await Portfolio.findOne({ where: { id: req.params.id, usuarioId: req.usuario.id } });
    if (!video) {
      return res.status(404).json({ mensagem: 'Vídeo não encontrado.' });
    }

    const { urlVideo, titulo } = req.body;
    if (urlVideo !== undefined && !ehLinkYoutubeValido(urlVideo)) {
      return res.status(400).json({ mensagem: 'Cole um link válido de vídeo do YouTube.' });
    }
    await video.update({ urlVideo: urlVideo ?? video.urlVideo, titulo: titulo ?? video.titulo });

    res.json({ mensagem: 'Vídeo atualizado!', video });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao editar vídeo.' });
  }
};

const excluirVideo = async (req, res) => {
  const video = await Portfolio.findOne({ where: { id: req.params.id, usuarioId: req.usuario.id } });
  if (!video) {
    return res.status(404).json({ mensagem: 'Vídeo não encontrado.' });
  }
  await video.destroy();
  res.json({ mensagem: 'Vídeo removido do portfólio.' });
};

const listarMeusVideos = async (req, res) => {
  const videos = await Portfolio.findAll({
    where: { usuarioId: req.usuario.id },
    order: [['createdAt', 'DESC']],
  });
  res.json(videos);
};

const listarVideosPorUsuario = async (req, res) => {
  const videos = await Portfolio.findAll({
    where: { usuarioId: req.params.usuarioId },
    order: [['createdAt', 'DESC']],
  });
  res.json(videos);
};

module.exports = { adicionarVideo, editarVideo, excluirVideo, listarMeusVideos, listarVideosPorUsuario };
