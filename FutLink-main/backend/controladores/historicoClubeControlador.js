const { HistoricoClube } = require('../modelos');
const { limparTexto } = require('../utilitarios/validacao');

const adicionarClube = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'atleta') {
      return res.status(403).json({ mensagem: 'Só atletas podem adicionar clubes ao histórico.' });
    }

    const nomeClube = limparTexto(req.body.nomeClube);
    const categoria = limparTexto(req.body.categoria);
    const cidade = limparTexto(req.body.cidade);
    const estado = limparTexto(req.body.estado)?.toUpperCase() ?? null;
    const anoInicio = limparTexto(req.body.anoInicio);
    const anoFim = limparTexto(req.body.anoFim);
    const descricao = limparTexto(req.body.descricao);
    if (!nomeClube) {
      return res.status(400).json({ mensagem: 'Informe o nome do clube.' });
    }
    if (nomeClube.length > 255) {
      return res.status(400).json({ mensagem: 'O nome do clube está longo demais.' });
    }
    if (estado && !/^[A-Z]{2}$/.test(estado)) {
      return res.status(400).json({ mensagem: 'Use a sigla do estado com 2 letras (ex.: RS).' });
    }
    if (descricao && descricao.length > 300) {
      return res.status(400).json({ mensagem: 'A descrição pode ter no máximo 300 caracteres.' });
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
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao adicionar clube.' });
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
