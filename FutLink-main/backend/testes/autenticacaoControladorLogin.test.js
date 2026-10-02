process.env.JWT_SECRET = 'segredo_de_teste';

jest.mock('../modelos', () => ({
  Usuario: {
    findOne: jest.fn(),
  },
}));

const bcrypt = require('bcryptjs');
const { Usuario } = require('../modelos');
const { login } = require('../controladores/autenticacaoControlador');

function criarRespostaFalsa() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('autenticacaoControlador.login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 400 quando falta e-mail ou senha', async () => {
    const req = { body: { email: 'teste@teste.com' } }; // sem senha
    const res = criarRespostaFalsa();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

  test('retorna 401 quando o e-mail não existe', async () => {
    Usuario.findOne.mockResolvedValue(null);
    const req = { body: { email: 'naoexiste@teste.com', senha: '123456' } };
    const res = criarRespostaFalsa();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: expect.stringContaining('inválidos') })
    );
  });

  test('retorna 401 quando a senha está incorreta', async () => {
    const senhaHash = await bcrypt.hash('senhaCorreta', 10);
    Usuario.findOne.mockResolvedValue({ id: 1, email: 'usuario@teste.com', senha: senhaHash });

    const req = { body: { email: 'usuario@teste.com', senha: 'senhaErrada' } };
    const res = criarRespostaFalsa();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('retorna 200 e um token quando e-mail e senha estão corretos', async () => {
    const senhaHash = await bcrypt.hash('senhaCorreta', 10);
    Usuario.findOne.mockResolvedValue({
      id: 7,
      nome: 'Fulano',
      email: 'usuario@teste.com',
      tipo: 'atleta',
      senha: senhaHash,
    });

    const req = { body: { email: 'usuario@teste.com', senha: 'senhaCorreta' } };
    const res = criarRespostaFalsa();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const corpoResposta = res.json.mock.calls[0][0];
    expect(corpoResposta.token).toEqual(expect.any(String));
    expect(corpoResposta.usuario).toMatchObject({ id: 7, nome: 'Fulano', tipo: 'atleta' });
  });
});
