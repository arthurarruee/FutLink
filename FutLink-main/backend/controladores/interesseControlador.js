const { Usuario, PerfilAtleta, PerfilEmpresario, Interesse, Match } = require('../modelos');

const enviarInteresse = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'empresario') {
      return res.status(403).json({ mensagem: 'Só empresários podem enviar interesse.' });
    }

    const { atletaId } = req.body;
    if (!atletaId) {
      return res.status(400).json({ mensagem: 'Informe o atleta.' });
    }

    const atleta = await Usuario.findOne({ where: { id: atletaId, tipo: 'atleta' } });
    if (!atleta) {
      return res.status(404).json({ mensagem: 'Atleta não encontrado.' });
    }

    const jaExiste = await Interesse.findOne({ where: { atletaId, empresarioId: req.usuario.id } });
    if (jaExiste) {
      return res.status(400).json({ mensagem: 'Você já enviou interesse para esse atleta.' });
    }

    const interesse = await Interesse.create({ atletaId, empresarioId: req.usuario.id });
    res.status(201).json({ mensagem: 'Interesse enviado!', interesse });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao enviar interesse.', erro: erro.message });
  }
};

const listarRecebidos = async (req, res) => {
  if (req.usuario.tipo !== 'atleta') {
    return res.status(403).json({ mensagem: 'Só atletas têm interesses recebidos.' });
  }

  const interesses = await Interesse.findAll({
    where: { atletaId: req.usuario.id },
    include: [{ model: Usuario, as: 'Empresario', attributes: ['id', 'nome', 'email'], include: [PerfilEmpresario] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(interesses);
};

const listarEnviados = async (req, res) => {
  if (req.usuario.tipo !== 'empresario') {
    return res.status(403).json({ mensagem: 'Só empresários enviam interesses.' });
  }

  const interesses = await Interesse.findAll({
    where: { empresarioId: req.usuario.id },
    include: [{ model: Usuario, as: 'Atleta', attributes: ['id', 'nome', 'email'], include: [PerfilAtleta] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(interesses);
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
    res.status(500).json({ mensagem: 'Erro ao aceitar interesse.', erro: erro.message });
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
