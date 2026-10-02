const { HistoricoCompeticao } = require('../modelos');

const adicionarCompeticao = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'atleta') {
      return res.status(403).json({ mensagem: 'Só atletas podem adicionar competições ao histórico.' });
    }

    const { nomeCompeticao, ano, clubeOuSelecao, resultado, descricao } = req.body;
    if (!nomeCompeticao) {
      return res.status(400).json({ mensagem: 'Informe o nome da competição.' });
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
    res.status(500).json({ mensagem: 'Erro ao adicionar competição.', erro: erro.message });
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
