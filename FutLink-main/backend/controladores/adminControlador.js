const { Usuario, PerfilEmpresario, Arquivo, Verificacao } = require('../modelos');
const { enviarArquivo } = require('./arquivoControlador');

const STATUS_VALIDOS = ['pendente', 'aprovado', 'recusado'];

// Lista as comprovações para o painel do administrador (com contagem por status).
const listarVerificacoes = async (req, res) => {
  const { status } = req.query;
  if (status && !STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ mensagem: 'Status inválido.' });
  }

  const [verificacoes, todas] = await Promise.all([
    Verificacao.findAll({
      where: status ? { status } : {},
      include: [{ model: Usuario, attributes: ['id', 'nome', 'email'], include: [PerfilEmpresario] }],
      order: [['updatedAt', 'ASC']],
    }),
    Verificacao.findAll({ attributes: ['status'] }),
  ]);

  const documentos = await Arquivo.findAll({
    where: { categoria: 'comprovacao', usuarioId: verificacoes.map((v) => v.usuarioId) },
    attributes: ['usuarioId', 'nomeOriginal', 'mimeType', 'tamanho', 'updatedAt'],
  });
  const porUsuario = new Map(documentos.map((d) => [d.usuarioId, d]));

  const contagem = { pendente: 0, aprovado: 0, recusado: 0 };
  todas.forEach((v) => { contagem[v.status] += 1; });

  res.json({
    contagem,
    itens: verificacoes.map((v) => {
      const doc = porUsuario.get(v.usuarioId);
      return {
        usuarioId: v.usuarioId,
        status: v.status,
        motivoRecusa: v.motivoRecusa,
        analisadoEm: v.analisadoEm,
        usuario: v.Usuario,
        documento: doc
          ? { nomeOriginal: doc.nomeOriginal, mimeType: doc.mimeType, tamanho: doc.tamanho, enviadoEm: doc.updatedAt }
          : null,
      };
    }),
  });
};

const baixarDocumento = async (req, res) => {
  const arquivo = await Arquivo.findOne({ where: { usuarioId: req.params.usuarioId, categoria: 'comprovacao' } });
  if (!arquivo) return res.status(404).json({ mensagem: 'Documento não encontrado.' });
  enviarArquivo(res, arquivo, { cache: 'private, no-store' });
};

// Aprovar ou recusar. Recusar exige um motivo, para o empresário saber o que corrigir.
const decidir = async (req, res) => {
  const { status } = req.body;
  const motivo = String(req.body.motivo || '').trim();
  if (!['aprovado', 'recusado'].includes(status)) {
    return res.status(400).json({ mensagem: 'Escolha "aprovado" ou "recusado".' });
  }
  if (status === 'recusado' && !motivo) {
    return res.status(400).json({ mensagem: 'Informe o motivo da recusa.' });
  }
  if (motivo.length > 300) {
    return res.status(400).json({ mensagem: 'O motivo pode ter no máximo 300 caracteres.' });
  }
  // Ninguém aprova a própria comprovação, mesmo sendo administrador.
  if (String(req.params.usuarioId) === String(req.usuario.id)) {
    return res.status(403).json({ mensagem: 'Você não pode analisar a sua própria comprovação.' });
  }

  const verificacao = await Verificacao.findOne({ where: { usuarioId: req.params.usuarioId } });
  const documento = await Arquivo.findOne({
    where: { usuarioId: req.params.usuarioId, categoria: 'comprovacao' },
    attributes: ['id'],
  });
  if (!verificacao || !documento) {
    return res.status(404).json({ mensagem: 'Comprovação não encontrada.' });
  }

  await verificacao.update({
    status,
    motivoRecusa: status === 'recusado' ? motivo : null,
    analisadoPorId: req.usuario.id,
    analisadoEm: new Date(),
  });
  res.json({ mensagem: status === 'aprovado' ? 'Empresário verificado com sucesso.' : 'Comprovação recusada.' });
};

module.exports = { listarVerificacoes, baixarDocumento, decidir };
