// Lista única de posições, usada no perfil, na pesquisa e nos interesses.
// Assim, o que o atleta escolhe no perfil é exatamente o que o empresário filtra.
export const POSICOES = ['Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meio-campo', 'Atacante'];

export const STATUS_INTERESSE = [
  { valor: 'pendente', rotulo: 'Pendente' },
  { valor: 'aceito', rotulo: 'Aceito' },
  { valor: 'recusado', rotulo: 'Recusado' },
];

// Valida o par de idades digitado nos filtros. Devolve uma mensagem de erro ou '' se estiver tudo certo.
export function validarFaixaDeIdade(idadeMin, idadeMax) {
  const minimo = idadeMin === '' ? null : Number(idadeMin);
  const maximo = idadeMax === '' ? null : Number(idadeMax);
  if ((minimo !== null && (!Number.isInteger(minimo) || minimo < 0 || minimo > 100)) ||
      (maximo !== null && (!Number.isInteger(maximo) || maximo < 0 || maximo > 100))) {
    return 'Informe idades inteiras entre 0 e 100.';
  }
  if (minimo !== null && maximo !== null && minimo > maximo) {
    return 'A idade mínima não pode ser maior que a máxima.';
  }
  return '';
}
