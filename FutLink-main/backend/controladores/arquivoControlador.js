const { Arquivo, Verificacao } = require('../modelos');
const {
  LIMITE_FOTO,
  LIMITE_DOCUMENTO,
  TIPOS_FOTO,
  TIPOS_DOCUMENTO,
  lerArquivoBase64,
  limparNomeArquivo,
} = require('../utilitarios/arquivos');

// Cria o arquivo do usuário ou, se já existir, troca o conteúdo (assim "alterar foto" = enviar outra).
const guardarArquivo = async (usuarioId, categoria, arquivo, nomeOriginal) => {
  const dados = {
    nomeOriginal: limparNomeArquivo(nomeOriginal),
    mimeType: arquivo.mimeType,
    tamanho: arquivo.tamanho,
    conteudo: arquivo.buffer,
  };
  const existente = await Arquivo.findOne({ where: { usuarioId, categoria } });
  if (existente) {
    await existente.update(dados);
    return existente;
  }
  return Arquivo.create({ usuarioId, categoria, ...dados });
};

// Envia o arquivo ao navegador com cabeçalhos seguros.
// - Content-Type vem do que NÓS detectamos nos bytes, nunca do que o usuário informou.
// - nosniff impede o navegador de "adivinhar" outro tipo.
const enviarArquivo = (res, arquivo, { cache }) => {
  res.set({
    'Content-Type': arquivo.mimeType,
    'Content-Length': arquivo.conteudo.length,
    'Content-Disposition': `inline; filename="${encodeURIComponent(arquivo.nomeOriginal || 'arquivo')}"`,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': cache,
  });
  res.send(arquivo.conteudo); // send() também gera ETag, permitindo cache com revalidação (304)
};

// ---------------------------------------------------------------- FOTO DE PERFIL

const salvarFoto = async (req, res) => {
  const { arquivo, erro } = lerArquivoBase64(req.body.dados, {
    tiposPermitidos: TIPOS_FOTO,
    limite: LIMITE_FOTO,
    rotulo: 'uma foto',
  });
  if (erro) return res.status(400).json({ mensagem: erro });
  await guardarArquivo(req.usuario.id, 'foto', arquivo, req.body.nomeOriginal);
  res.json({ mensagem: 'Foto atualizada com sucesso!' });
};

const removerFoto = async (req, res) => {
  await Arquivo.destroy({ where: { usuarioId: req.usuario.id, categoria: 'foto' } });
  res.json({ mensagem: 'Foto removida.' });
};

// Qualquer usuário LOGADO pode ver as fotos (aparecem nos cards e conversas).
// Sem foto -> 204 (sem conteúdo), para o front mostrar as iniciais sem gerar erro.
const baixarFoto = async (req, res) => {
  const arquivo = await Arquivo.findOne({
    where: { usuarioId: req.params.usuarioId, categoria: 'foto' },
    attributes: ['nomeOriginal', 'mimeType', 'conteudo'],
  });
  if (!arquivo) return res.status(204).end();
  enviarArquivo(res, arquivo, { cache: 'private, no-cache' });
};

// ---------------------------------------------------------------- COMPROVAÇÃO PROFISSIONAL

const exigirEmpresario = (req, res) => {
  if (req.usuario.tipo !== 'empresario') {
    res.status(403).json({ mensagem: 'A comprovação profissional é exclusiva para empresários.' });
    return false;
  }
  return true;
};

const consultarMinhaComprovacao = async (req, res) => {
  if (!exigirEmpresario(req, res)) return;
  const [verificacao, documento] = await Promise.all([
    Verificacao.findOne({ where: { usuarioId: req.usuario.id } }),
    Arquivo.findOne({
      where: { usuarioId: req.usuario.id, categoria: 'comprovacao' },
      attributes: ['nomeOriginal', 'mimeType', 'tamanho', 'updatedAt'],
    }),
  ]);
  if (!documento) return res.json({ status: null, documento: null });
  res.json({
    status: verificacao ? verificacao.status : 'pendente',
    motivoRecusa: verificacao?.status === 'recusado' ? verificacao.motivoRecusa : null,
    analisadoEm: verificacao?.analisadoEm || null,
    documento: {
      nomeOriginal: documento.nomeOriginal,
      mimeType: documento.mimeType,
      tamanho: documento.tamanho,
      enviadoEm: documento.updatedAt,
    },
  });
};

// Enviar (ou substituir) NUNCA aprova: o status volta para "pendente" e espera um administrador.
const enviarComprovacao = async (req, res) => {
  if (!exigirEmpresario(req, res)) return;
  const { arquivo, erro } = lerArquivoBase64(req.body.dados, {
    tiposPermitidos: TIPOS_DOCUMENTO,
    limite: LIMITE_DOCUMENTO,
    rotulo: 'um documento',
  });
  if (erro) return res.status(400).json({ mensagem: erro });

  await guardarArquivo(req.usuario.id, 'comprovacao', arquivo, req.body.nomeOriginal);

  const reiniciar = { status: 'pendente', motivoRecusa: null, analisadoPorId: null, analisadoEm: null };
  const verificacao = await Verificacao.findOne({ where: { usuarioId: req.usuario.id } });
  if (verificacao) await verificacao.update(reiniciar);
  else await Verificacao.create({ usuarioId: req.usuario.id, ...reiniciar });

  res.status(201).json({ mensagem: 'Documento enviado! Ele será analisado por nossa equipe.' });
};

const removerComprovacao = async (req, res) => {
  if (!exigirEmpresario(req, res)) return;
  await Arquivo.destroy({ where: { usuarioId: req.usuario.id, categoria: 'comprovacao' } });
  await Verificacao.destroy({ where: { usuarioId: req.usuario.id } });
  res.json({ mensagem: 'Documento removido.' });
};

// Só o DONO do documento baixa o próprio arquivo (o administrador tem rota própria).
const baixarMinhaComprovacao = async (req, res) => {
  if (!exigirEmpresario(req, res)) return;
  const arquivo = await Arquivo.findOne({ where: { usuarioId: req.usuario.id, categoria: 'comprovacao' } });
  if (!arquivo) return res.status(404).json({ mensagem: 'Nenhum documento enviado.' });
  enviarArquivo(res, arquivo, { cache: 'private, no-store' });
};

module.exports = {
  enviarArquivo,
  salvarFoto,
  removerFoto,
  baixarFoto,
  consultarMinhaComprovacao,
  enviarComprovacao,
  removerComprovacao,
  baixarMinhaComprovacao,
};
