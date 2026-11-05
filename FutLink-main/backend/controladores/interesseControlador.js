const { Usuario, PerfilAtleta, PerfilEmpresario, Interesse, Match, Verificacao } = require('../modelos');
const { lerFiltrosAtleta, perfilCombinaComFiltros } = require('../utilitarios/filtrosAtleta');
const { limparTexto } = require('../utilitarios/validacao');

const STATUS_VALIDOS = ['pendente', 'aceito', 'recusado'];

// Lê ?status=... da URL. Devolve { status } (null = todos) ou { erro }.
const lerStatus = (consulta) => {
  const status = limparTexto(consulta.status);
  if (status && !STATUS_VALIDOS.includes(status)) return { erro: 'Status inválido.' };
  return { status };
};

// Inclui o selo só quando a comprovação foi APROVADA (pendente/recusado não aparecem para os outros).
const incluirSelo = { model: Verificacao, attributes: ['status'], where: { status: 'aprovado' }, required: false };

// ENVIAR INTERESSE
// Idempotente: se o empresário clicar duas vezes (ou o navegador repetir o pedido), NÃO cria um segundo
// interesse e NÃO devolve erro assustador — responde 200 com o status atual. Só a 1ª vez devolve 201.
const MENSAGEM_JA_EXISTE = {
  pendente: 'Você já enviou interesse para este atleta. Aguarde a resposta dele.',
  aceito: 'Este atleta já aceitou seu interesse: vocês têm um match!',
  recusado: 'Este atleta já respondeu ao seu interesse anterior.',
};

const enviarInteresse = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'empresario') {
      return res.status(403).json({ mensagem: 'Só empresários podem enviar interesse.' });
    }

    const atletaId = Number(req.body.atletaId);
    if (!req.body.atletaId || !Number.isInteger(atletaId) || atletaId <= 0) {
      return res.status(400).json({ mensagem: 'Informe o atleta.' });
    }

    const atleta = await Usuario.findOne({ where: { id: atletaId, tipo: 'atleta' } });
    if (!atleta) {
      return res.status(404).json({ mensagem: 'Atleta não encontrado.' });
    }

    const where = { atletaId, empresarioId: req.usuario.id };
    let interesse = await Interesse.findOne({ where });
    let criado = false;

    if (!interesse) {
      try {
        interesse = await Interesse.create(where);
        criado = true;
      } catch (erroCriacao) {
        // Dois cliques ao mesmo tempo: o índice único do banco barra o segundo. Tratamos como "já existe".
        if (erroCriacao.name !== 'SequelizeUniqueConstraintError') throw erroCriacao;
        interesse = await Interesse.findOne({ where });
      }
    }

    if (!criado) {
      return res.status(200).json({
        mensagem: MENSAGEM_JA_EXISTE[interesse.status],
        jaEnviado: true,
        status: interesse.status,
        interesse,
      });
    }
    res.status(201).json({ mensagem: 'Interesse enviado com sucesso!', status: interesse.status, interesse });
  } catch (erro) {
    // name/code ajudam a descobrir a causa nos Logs do Render (ex.: ETIMEDOUT, PROTOCOL_CONNECTION_LOST).
    console.error('Erro ao enviar interesse:', erro.name, erro.parent?.code || erro.code || '', erro.message);
    res.status(500).json({ mensagem: 'Não foi possível enviar o interesse agora. Tente novamente.' });
  }
};

const listarRecebidos = async (req, res) => {
  if (req.usuario.tipo !== 'atleta') {
    return res.status(403).json({ mensagem: 'Só atletas têm interesses recebidos.' });
  }

  const { status, erro } = lerStatus(req.query);
  if (erro) return res.status(400).json({ mensagem: erro });

  const interesses = await Interesse.findAll({
    where: { atletaId: req.usuario.id, ...(status ? { status } : {}) },
    include: [{ model: Usuario, as: 'Empresario', attributes: ['id', 'nome', 'email'], include: [PerfilEmpresario, incluirSelo] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(interesses);
};

// LISTA DE INTERESSES ENVIADOS (empresário) — aceita filtros pela URL, todos opcionais e combináveis:
//   ?status=pendente|aceito|recusado  &posicao=Goleiro  &cidade=Porto  &estado=RS  &idadeMin=15  &idadeMax=18
// Os filtros de posição/cidade/idade usam o perfil do atleta; o de status usa o próprio interesse.
const listarEnviados = async (req, res) => {
  if (req.usuario.tipo !== 'empresario') {
    return res.status(403).json({ mensagem: 'Só empresários enviam interesses.' });
  }

  const { status, erro: erroStatus } = lerStatus(req.query);
  if (erroStatus) return res.status(400).json({ mensagem: erroStatus });
  const { filtros, erro: erroFiltros } = lerFiltrosAtleta(req.query);
  if (erroFiltros) return res.status(400).json({ mensagem: erroFiltros });

  const interesses = await Interesse.findAll({
    where: { empresarioId: req.usuario.id, ...(status ? { status } : {}) },
    include: [{ model: Usuario, as: 'Atleta', attributes: ['id', 'nome', 'email'], include: [PerfilAtleta] }],
    order: [['createdAt', 'DESC']],
  });

  res.json(interesses.filter((interesse) => perfilCombinaComFiltros(interesse.Atleta?.PerfilAtleta, filtros)));
};

const aceitarInteresse = async (req, res) => {
  try {
    const interesse = await Interesse.findOne({ where: { id: req.params.id, atletaId: req.usuario.id } });
    if (!interesse) {
      return res.status(404).json({ mensagem: 'Interesse não encontrado.' });
    }
    if (interesse.status !== 'pendente') {
      return res.status(400).json({ mensagem: 'Esse interesse já foi respondido.' });
    }

    await interesse.update({ status: 'aceito' });
    await Match.findOrCreate({
      where: { atletaId: interesse.atletaId, empresarioId: interesse.empresarioId },
    });

    res.json({ mensagem: 'Interesse aceito! Vocês agora têm um match.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao aceitar interesse.' });
  }
};

const recusarInteresse = async (req, res) => {
  const interesse = await Interesse.findOne({ where: { id: req.params.id, atletaId: req.usuario.id } });
  if (!interesse) {
    return res.status(404).json({ mensagem: 'Interesse não encontrado.' });
  }
  if (interesse.status !== 'pendente') {
    return res.status(400).json({ mensagem: 'Esse interesse já foi respondido.' });
  }

  await interesse.update({ status: 'recusado' });
  res.json({ mensagem: 'Interesse recusado.' });
};

const consultarStatus = async (req, res) => {
  if (req.usuario.tipo !== 'empresario') {
    return res.status(403).json({ mensagem: 'Só empresários podem consultar esse status.' });
  }

  const interesse = await Interesse.findOne({
    where: { atletaId: req.params.atletaId, empresarioId: req.usuario.id },
  });
  res.json({ status: interesse ? interesse.status : 'nao_enviado' });
};

module.exports = {
  enviarInteresse,
  listarRecebidos,
  listarEnviados,
  aceitarInteresse,
  recusarInteresse,
  consultarStatus,
};
