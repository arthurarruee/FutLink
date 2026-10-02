const Interesse = require('../modelos/Interesse');

// Teste mais básico possível: só checa o comportamento do model em memória
// (Interesse.build não grava nada no banco, só monta o objeto com as regras do model).
describe('Model Interesse', () => {
  test('usa "pendente" como status padrão quando nenhum status é informado', () => {
    const interesse = Interesse.build({ atletaId: 1, empresarioId: 2 });

    expect(interesse.status).toBe('pendente');
  });

  test('aceita um status válido quando ele é informado', () => {
    const interesse = Interesse.build({ atletaId: 1, empresarioId: 2, status: 'aceito' });

    expect(interesse.status).toBe('aceito');
  });

  test('a definição do status só permite os valores "pendente", "aceito" e "recusado"', () => {
    const valoresPermitidos = Interesse.rawAttributes.status.values;

    expect(valoresPermitidos).toEqual(['pendente', 'aceito', 'recusado']);
    expect(valoresPermitidos).not.toContain('cancelado');
  });
});
