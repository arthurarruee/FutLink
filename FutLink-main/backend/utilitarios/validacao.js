// Funções pequenas de validação, reaproveitadas pelos controladores.
// Ideia: validar NO BACKEND, porque o front-end pode ser burlado (qualquer pessoa consegue chamar a API direto).

// Transforma texto vazio ("" ou só espaços) em null. O MySQL rejeita "" em campos
// numéricos e ENUM, então esse tratamento evita o erro 500 ao salvar o perfil.
const limparTexto = (valor) => {
  if (valor === undefined || valor === null) return null;
  const texto = String(valor).trim();
  return texto === '' ? null : texto;
};

const ehEmailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));

// Mesmo padrão usado no front-end (frontend/src/servicos/youtube.js).
const PADRAO_YOUTUBE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const ehLinkYoutubeValido = (url) => PADRAO_YOUTUBE.test(String(url || ''));

const temCampo = (corpo, campo) => Object.prototype.hasOwnProperty.call(corpo || {}, campo);

module.exports = { limparTexto, ehEmailValido, ehLinkYoutubeValido, temCampo };
