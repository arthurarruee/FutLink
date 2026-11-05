// Regras de segurança para arquivos enviados.
// Nunca confiamos no que o navegador diz ("é um PDF"): conferimos os primeiros bytes do arquivo
// (a "assinatura" do formato). Assim, um .exe renomeado para .jpg é recusado.

const LIMITE_FOTO = 2 * 1024 * 1024; // 2 MB
const LIMITE_DOCUMENTO = 5 * 1024 * 1024; // 5 MB

const detectarTipo = (buffer) => {
  if (!buffer || buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buffer.slice(0, 4).toString('latin1') === 'RIFF' && buffer.slice(8, 12).toString('latin1') === 'WEBP') return 'image/webp';
  if (buffer.slice(0, 5).toString('latin1') === '%PDF-') return 'application/pdf';
  return null;
};

const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];
const TIPOS_DOCUMENTO = [...TIPOS_FOTO, 'application/pdf'];

// Converte o texto base64 enviado pelo front em arquivo (Buffer) e valida tudo.
// Devolve { arquivo: { buffer, mimeType, tamanho } } ou { erro: 'mensagem' }.
const lerArquivoBase64 = (dados, { tiposPermitidos, limite, rotulo }) => {
  if (typeof dados !== 'string' || dados.length === 0) {
    return { erro: `Envie ${rotulo}.` };
  }
  // Aceita tanto "data:image/png;base64,AAAA" quanto só "AAAA".
  const base64 = dados.includes(',') ? dados.split(',')[1] : dados;
  // Barreira barata ANTES de decodificar: base64 ocupa ~4/3 do tamanho real.
  if (base64.length > Math.ceil((limite * 4) / 3) + 8) {
    return { erro: `O arquivo é grande demais (máximo ${Math.round(limite / 1024 / 1024)} MB).` };
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
    return { erro: 'Arquivo inválido.' };
  }
  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length > limite) {
    return { erro: `O arquivo é grande demais (máximo ${Math.round(limite / 1024 / 1024)} MB).` };
  }
  const mimeType = detectarTipo(buffer);
  if (!mimeType || !tiposPermitidos.includes(mimeType)) {
    const aceitos = tiposPermitidos.includes('application/pdf') ? 'PDF, JPG, PNG ou WEBP' : 'JPG, PNG ou WEBP';
    return { erro: `Formato não permitido. Use ${aceitos}.` };
  }
  return { arquivo: { buffer, mimeType, tamanho: buffer.length } };
};

// Nome do arquivo "limpo": sem caminhos e com tamanho limitado.
const limparNomeArquivo = (nome) => {
  const base = String(nome || 'arquivo').split(/[\\/]/).pop().replace(/[^\w.\- ()À-ÿ]/g, '_');
  return base.slice(0, 120) || 'arquivo';
};

module.exports = {
  LIMITE_FOTO,
  LIMITE_DOCUMENTO,
  TIPOS_FOTO,
  TIPOS_DOCUMENTO,
  detectarTipo,
  lerArquivoBase64,
  limparNomeArquivo,
};
