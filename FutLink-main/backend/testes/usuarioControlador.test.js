jest.mock('../modelos', () => ({
  Usuario: {
    findByPk: jest.fn(),
  },
}));

const { Usuario } = require('../modelos');
const { buscarMeuUsuario, excluirMinhaConta } = require('../controladores/usuarioControlador');

function criarRespostaFalsa() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('usuarioControlador.buscarMeuUsuario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 404 quando o usuário do token não existe mais', async () => {
    Usuario.findByPk.mockResolvedValue(null);
    const req = { usuario: { id: 999 } };
    const res = criarRespostaFalsa();

    await buscarMeuUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('retorna os dados do usuário (sem a senha) quando ele existe', async () => {
    const usuarioFalso = { id: 1, nome: 'Fulano', email: 'fulano@teste.com', tipo: 'atleta' };
    Usuario.findByPk.mockResolvedValue(usuarioFalso);
    const req = { usuario: { id: 1 } };
    const res = criarRespostaFalsa();

    await buscarMeuUsuario(req, res);

    // Confere que a busca excluiu explicitamente o campo "senha" do resultado.
    expect(Usuario.findByPk).toHaveBeenCalledWith(1, { attributes: { exclude: ['senha'] } });
    expect(res.json).toHaveBeenCalledWith(usuarioFalso);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('usuarioControlador.excluirMinhaConta', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 404 quando o usuário não existe', async () => {
    Usuario.findByPk.mockResolvedValue(null);
    const req = { usuario: { id: 123 } };
    const res = criarRespostaFalsa();

    await excluirMinhaConta(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('exclui a conta e confirma com uma mensagem de sucesso', async () => {
    const destroy = jest.fn().mockResolvedValue(true);
    Usuario.findByPk.mockResolvedValue({ id: 5, destroy });
    const req = { usuario: { id: 5 } };
    const res = criarRespostaFalsa();

    await excluirMinhaConta(req, res);

    expect(destroy).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: expect.stringContaining('excluída') })
    );
  });
});
