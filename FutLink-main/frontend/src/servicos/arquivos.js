import api from './api';

// ------------------------------------------------------------------ regras (iguais às do backend)
export const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];
export const TIPOS_DOCUMENTO = [...TIPOS_FOTO, 'application/pdf'];
export const LIMITE_FOTO_ORIGINAL_MB = 8; // a foto é reduzida antes do envio, então aceitamos originais maiores
export const LIMITE_DOCUMENTO_MB = 5;

export function formatarTamanho(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Lê um arquivo do computador e devolve o conteúdo em texto base64 (formato que a API recebe).
function lerComoDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    leitor.readAsDataURL(arquivo);
  });
}

// ------------------------------------------------------------------ foto de perfil
// Valida e REDUZ a foto (máx. 640 px, JPEG). Vantagens: upload rápido, banco leve e a foto
// nunca passa do limite de 2 MB do servidor.
export async function prepararFoto(arquivo) {
  if (!TIPOS_FOTO.includes(arquivo.type)) {
    throw new Error('Formato não permitido. Use uma imagem JPG, PNG ou WEBP.');
  }
  if (arquivo.size > LIMITE_FOTO_ORIGINAL_MB * 1024 * 1024) {
    throw new Error(`A foto é muito grande (máximo ${LIMITE_FOTO_ORIGINAL_MB} MB).`);
  }
  const url = await lerComoDataUrl(arquivo);
  const imagem = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Não foi possível abrir essa imagem.'));
    img.src = url;
  });
  const MAXIMO = 640;
  const escala = Math.min(1, MAXIMO / Math.max(imagem.width, imagem.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(imagem.width * escala);
  canvas.height = Math.round(imagem.height * escala);
  const contexto = canvas.getContext('2d');
  contexto.fillStyle = '#ffffff'; // PNG com fundo transparente vira fundo branco no JPEG
  contexto.fillRect(0, 0, canvas.width, canvas.height);
  contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

export async function enviarFoto(arquivo, usuarioId) {
  const dados = await prepararFoto(arquivo);
  await api.put('/arquivos/foto', { dados, nomeOriginal: arquivo.name });
  invalidarFoto(usuarioId);
}

export async function removerFoto(usuarioId) {
  await api.delete('/arquivos/foto');
  invalidarFoto(usuarioId);
}

// ------------------------------------------------------------------ cache das fotos
// <img src="..."> não consegue enviar o token de login, e as fotos só podem ser vistas por quem
// está logado. Por isso buscamos a imagem pela API (com o token), criamos um endereço temporário
// no navegador (blob:) e guardamos aqui para não baixar a mesma foto várias vezes.
const cacheFotos = new Map();

export function carregarFoto(usuarioId) {
  const chave = String(usuarioId);
  if (!cacheFotos.has(chave)) {
    const promessa = api
      .get(`/arquivos/foto/${chave}`, { responseType: 'blob' })
      .then((resposta) => (resposta.status === 200 && resposta.data.size > 0 ? URL.createObjectURL(resposta.data) : null))
      .catch(() => {
        cacheFotos.delete(chave); // falhou: tenta de novo na próxima vez
        return null;
      });
    cacheFotos.set(chave, promessa);
  }
  return cacheFotos.get(chave);
}

// Chamar depois de trocar/remover a foto: limpa o cache e avisa os <Avatar> na tela para recarregarem.
export function invalidarFoto(usuarioId) {
  cacheFotos.delete(String(usuarioId));
  window.dispatchEvent(new CustomEvent('futlink:foto', { detail: String(usuarioId) }));
}

// Quando alguém sai, esvaziamos o cache para a próxima pessoa não ver fotos da anterior.
export function limparCacheFotos() {
  cacheFotos.clear();
}

// ------------------------------------------------------------------ documentos privados
export function validarDocumento(arquivo) {
  if (!TIPOS_DOCUMENTO.includes(arquivo.type)) {
    return 'Formato não permitido. Envie um PDF ou uma imagem (JPG, PNG, WEBP).';
  }
  if (arquivo.size > LIMITE_DOCUMENTO_MB * 1024 * 1024) {
    return `O arquivo é muito grande (máximo ${LIMITE_DOCUMENTO_MB} MB).`;
  }
  return null;
}

export async function enviarDocumento(arquivo) {
  const dados = await lerComoDataUrl(arquivo);
  await api.put('/arquivos/comprovacao', { dados, nomeOriginal: arquivo.name });
}

// Abre um arquivo PRIVADO (que exige login) em uma nova aba.
// A aba é aberta logo no clique (senão o navegador bloqueia como "pop-up") e recebe o arquivo depois.
export async function abrirArquivoPrivado(rota) {
  const janela = window.open('', '_blank');
  try {
    const resposta = await api.get(rota, { responseType: 'blob' });
    const url = URL.createObjectURL(resposta.data);
    if (janela) janela.location.href = url;
    else window.location.href = url;
  } catch (erro) {
    if (janela) janela.close();
    throw erro;
  }
}
