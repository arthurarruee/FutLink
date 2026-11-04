const { HistoricoCompeticao } = require('../modelos');
const { limparTexto } = require('../utilitarios/validacao');

const RESULTADOS_VALIDOS = ['Participação', 'Campeão', 'Vice-campeão', 'Semifinalista', 'Outro'];

const adicionarCompeticao = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'atleta') {
      return res.status(403).json({ mensagem: 'Só atletas podem adicionar competições ao histórico.' });
    }

    const nomeCompeticao = limparTexto(req.body.nomeCompeticao);
    const ano = limparTexto(req.body.ano);
    const clubeOuSelecao = limparTexto(req.body.clubeOuSelecao);
    const resultado = limparTexto(req.body.resultado);
    const descricao = limparTexto(req.body.descricao);
    if (!nomeCompeticao) {
      return res.status(400).json({ mensagem: 'Informe o nome da competição.' });
    }
    if (nomeCompeticao.length > 255) {
      return res.status(400).json({ mensagem: 'O nome da competição está longo demais.' });
    }
    if (resultado && !RESULTADOS_VALIDOS.includes(resultado)) {
      return res.status(400).json({ mensagem: 'Resultado inválido.' });
    }
    if (descricao && descricao.length > 300) {
      return res.status(400).json({ mensagem: 'A descrição pode ter no máximo 300 caracteres.' });
    }

    const item = await HistoricoCompeticao.create({
      usuarioId: req.usuario.id,
      nomeCompeticao,
      ano,
      clubeOuSelecao,
      resultado,
      descricao,
    });

    res.status(201).json({ mensagem: 'Competição adicionada ao histórico!', item });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao adicionar competição.' });
  }
};

const excluirCompeticao = async (req, res) => {
  const item = await HistoricoCompeticao.findOne({ where: { id: req.params.id, usuarioId: req.usuario.id } });
  if (!item) {
    return res.status(404).json({ mensagem: 'Competição não encontrada no seu histórico.' });
  }
  await item.destroy();
  res.json({ mensagem: 'Competição removida do histórico.' });
};

const listarMinhasCompeticoes = async (req, res) => {
  const itens = await HistoricoCompeticao.findAll({
    where: { usuarioId: req.usuario.id },
    order: [['createdAt', 'DESC']],
  });
  res.json(itens);
};

const listarCompeticoesPorUsuario = async (req, res) => {
  const itens = await HistoricoCompeticao.findAll({
    where: { usuarioId: req.params.usuarioId },
    order: [['createdAt', 'DESC']],
  });
  res.json(itens);
};

module.exports = {
  adicionarCompeticao,
  excluirCompeticao,
  listarMinhasCompeticoes,
  listarCompeticoesPorUsuario,
};
