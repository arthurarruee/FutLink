process.env.JWT_SECRET = 'segredo_de_teste';

// Mocamos o módulo de modelos pra não precisar de um banco de dados real nesse teste.
jest.mock('../modelos', () => ({
  Usuario: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const bcrypt = require('bcryptjs');
const { Usuario } = require('../modelos');
const { registrar } = require('../controladores/autenticacaoControlador');

function criarRespostaFalsa() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('autenticacaoControlador.registrar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 400 quando falta algum campo obrigatório', async () => {
    const req = { body: { nome: 'Fulano', email: 'fulano@teste.com' } }; // sem senha nem tipo
    const res = criarRespostaFalsa();

    await registrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Usuario.create).not.toHaveBeenCalled();
  });

  test('retorna 400 quando já existe uma conta com esse e-mail', async () => {
    Usuario.findOne.mockResolvedValue({ id: 1, email: 'ja-existe@teste.com' });
    const req = {
      body: { nome: 'Fulano', email: 'ja-existe@teste.com', senha: '123456', tipo: 'atleta' },
    };
    const res = criarRespostaFalsa();

    await registrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: expect.stringContaining('Já existe uma conta') })
    );
    expect(Usuario.create).not.toHaveBeenCalled();
  });

  test('cria o usuário com a senha criptografada e devolve um token', async () => {
    Usuario.findOne.mockResolvedValue(null);
    Usuario.create.mockImplementation(async (dados) => ({ id: 10, ...dados }));

    const req = {
      body: { nome: 'Fulano', email: 'novo@teste.com', senha: 'minhaSenha123', tipo: 'atleta' },
    };
    const res = criarRespostaFalsa();

    await registrar(req, res);

    expect(Usuario.create).toHaveBeenCalledTimes(1);
    const dadosCriados = Usuario.create.mock.calls[0][0];

    // A senha nunca deve ser salva em texto puro.
    expect(dadosCriados.senha).not.toBe('minhaSenha123');
    const senhaConfere = await bcrypt.compare('minhaSenha123', dadosCriados.senha);
    expect(senhaConfere).toBe(true);

    expect(res.status).toHaveBeenCalledWith(201);
    const corpoResposta = res.json.mock.calls[0][0];
    expect(corpoResposta.token).toEqual(expect.any(String));
    expect(corpoResposta.usuario).toMatchObject({ id: 10, nome: 'Fulano', email: 'novo@teste.com', tipo: 'atleta' });
    // A senha (mesmo criptografada) nunca deve voltar na resposta.
    expect(corpoResposta.usuario.senha).toBeUndefined();
  });
});
