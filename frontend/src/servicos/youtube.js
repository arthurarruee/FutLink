export function extrairIdYoutube(url) {
  if (!url) return null;
  const padrao = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const encontrado = url.match(padrao);
  return encontrado ? encontrado[1] : null;
}
