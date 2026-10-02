const { HistoricoClube } = require('../modelos');

const adicionarClube = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'atleta') {
      return res.status(403).json({ mensagem: 'Só atletas podem adicionar clubes ao histórico.' });
    }

    const { nomeClube, categoria, cidade, estado, anoInicio, anoFim, descricao } = req.body;
    if (!nomeClube) {
      return res.status(400).json({ mensagem: 'Informe o nome do clube.' });
    }

    const item = await HistoricoClube.create({
      usuarioId: req.usuario.id,
      nomeClube,
      categoria,
      cidade,
      estado,
      anoInicio,
      anoFim,
      descricao,
    });

    res.status(201).json({ mensagem: 'Clube adicionado ao histórico!', item });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao adicionar clube.', erro: erro.message });
  }
};

const excluirClube = async (req, res) => {
  const item = await HistoricoClube.findOne({ where: { id: req.params.id, usuarioId: req.usuario.id } });
  if (!item) {
    return res.status(404).json({ mensagem: 'Clube não encontrado no seu histórico.' });
  }
  await item.destroy();
  res.json({ mensagem: 'Clube removido do histórico.' });
};

const listarMeusClubes = async (req, res) => {
  const itens = await HistoricoClube.findAll({
    where: { usuarioId: req.usuario.id },
    order: [['createdAt', 'DESC']],
  });
  res.json(itens);
};

const listarClubesPorUsuario = async (req, res) => {
  const itens = await HistoricoClube.findAll({
    where: { usuarioId: req.params.usuarioId },
    order: [['createdAt', 'DESC']],
  });
  res.json(itens);
};

module.exports = {
  adicionarClube,
  excluirClube,
  listarMeusClubes,
  listarClubesPorUsuario,
};
