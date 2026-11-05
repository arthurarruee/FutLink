const { Op } = require('sequelize');
const { limparTexto } = require('./validacao');

// ---------------------------------------------------------------------------------------------
// POSIÇÕES
// O perfil guarda a posição como TEXTO. Se o banco tiver "Meia" de um cadastro antigo e o filtro
// pedir "Meio-campo", uma comparação exata não acharia o atleta. Por isso cada posição tem uma
// lista de variações aceitas (sem diferenciar maiúsculas/acentos).
// ---------------------------------------------------------------------------------------------
const GRUPOS_POSICAO = {
  Goleiro: ['Goleiro', 'Goleira'],
  Zagueiro: ['Zagueiro', 'Zagueiro central', 'Zagueira'],
  Lateral: ['Lateral', 'Lateral direito', 'Lateral esquerdo', 'Lateral-direito', 'Lateral-esquerdo'],
  Volante: ['Volante', 'Primeiro volante', 'Segundo volante'],
  'Meio-campo': ['Meio-campo', 'Meio campo', 'Meia', 'Meio-campista', 'Meiocampista', 'Meio campista'],
  Atacante: ['Atacante', 'Centroavante'],
};

// "São Paulo" -> "sao paulo" (minúsculo, sem acento, sem espaços sobrando)
const semAcento = (texto) =>
  String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');

// Descobre a posição "oficial" de um texto: "meia" -> "Meio-campo". Se não conhecer, devolve o próprio texto.
const posicaoCanonica = (valor) => {
  const alvo = semAcento(valor);
  if (!alvo) return null;
  for (const [canonica, variacoes] of Object.entries(GRUPOS_POSICAO)) {
    if (variacoes.some((v) => semAcento(v) === alvo)) return canonica;
  }
  return String(valor).trim();
};

const variacoesDaPosicao = (valor) => {
  const canonica = posicaoCanonica(valor);
  return GRUPOS_POSICAO[canonica] || [canonica];
};

// Escapa % e _ para que o usuário não "invente" curingas ao digitar a cidade.
const escaparLike = (texto) => String(texto).replace(/[\\%_]/g, (c) => `\\${c}`);

// ---------------------------------------------------------------------------------------------
// LEITURA E VALIDAÇÃO dos filtros que chegam na URL (?posicao=...&cidade=...&idadeMin=...)
// Devolve { filtros } ou { erro }.
// ---------------------------------------------------------------------------------------------
const lerIdade = (valor, rotulo) => {
  const texto = limparTexto(valor);
  if (texto === null) return { idade: null };
  const numero = Number(texto);
  if (!Number.isInteger(numero) || numero < 0 || numero > 100) {
    return { erro: `${rotulo} inválida. Informe um número inteiro entre 0 e 100.` };
  }
  return { idade: numero };
};

const lerFiltrosAtleta = (consulta = {}) => {
  const minimo = lerIdade(consulta.idadeMin, 'Idade mínima');
  if (minimo.erro) return { erro: minimo.erro };
  const maximo = lerIdade(consulta.idadeMax, 'Idade máxima');
  if (maximo.erro) return { erro: maximo.erro };
  if (minimo.idade !== null && maximo.idade !== null && minimo.idade > maximo.idade) {
    return { erro: 'A idade mínima não pode ser maior que a máxima.' };
  }
  const estado = limparTexto(consulta.estado);
  return {
    filtros: {
      posicao: limparTexto(consulta.posicao),
      cidade: limparTexto(consulta.cidade),
      estado: estado ? estado.toUpperCase() : null,
      idadeMin: minimo.idade,
      idadeMax: maximo.idade,
    },
  };
};

const temFiltroDePerfil = (f) => Boolean(f.posicao || f.cidade || f.estado || f.idadeMin !== null || f.idadeMax !== null);

// Versão 1: transforma os filtros em "where" do Sequelize (consulta feita pelo próprio MySQL).
// Usada na Pesquisa de atletas.
const filtrosParaWhere = (f) => {
  const where = {};
  if (f.posicao) where.posicao = { [Op.in]: variacoesDaPosicao(f.posicao) };
  if (f.cidade) where.cidade = { [Op.like]: `%${escaparLike(f.cidade)}%` };
  if (f.estado) where.estado = f.estado;
  if (f.idadeMin !== null || f.idadeMax !== null) {
    where.idade = {};
    if (f.idadeMin !== null) where.idade[Op.gte] = f.idadeMin;
    if (f.idadeMax !== null) where.idade[Op.lte] = f.idadeMax;
  }
  return where;
};

// Versão 2: confere um perfil já carregado (usada na lista de Interesses, que já traz o perfil junto).
// Segue EXATAMENTE as mesmas regras da versão 1; todos os filtros se somam (E lógico).
const perfilCombinaComFiltros = (perfil, f) => {
  if (!temFiltroDePerfil(f)) return true;
  if (!perfil) return false; // atleta sem perfil preenchido não combina com nenhum critério
  if (f.posicao && posicaoCanonica(perfil.posicao) !== posicaoCanonica(f.posicao)) return false;
  if (f.cidade && !semAcento(perfil.cidade).includes(semAcento(f.cidade))) return false;
  if (f.estado && String(perfil.estado || '').toUpperCase() !== f.estado) return false;
  if (f.idadeMin !== null && !(Number(perfil.idade) >= f.idadeMin)) return false;
  if (f.idadeMax !== null && !(Number(perfil.idade) <= f.idadeMax)) return false;
  return true;
};

module.exports = {
  escaparLike,
  GRUPOS_POSICAO,
  semAcento,
  posicaoCanonica,
  variacoesDaPosicao,
  lerFiltrosAtleta,
  temFiltroDePerfil,
  filtrosParaWhere,
  perfilCombinaComFiltros,
};
