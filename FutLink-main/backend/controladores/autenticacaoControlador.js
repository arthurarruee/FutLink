const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../modelos');
const { ehEmailValido } = require('../utilitarios/validacao');
const gerarToken = (usuario) => {
    return jwt.sign({ id: usuario.id, tipo: usuario.tipo }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
const registrar = async (req, res) => {
    try {
        const { senha, tipo } = req.body;
        // trim() tira espaços sem querer; e-mail em minúsculas evita contas "duplicadas" por maiúsculas.
        const nome = String(req.body.nome || '').trim();
        const email = String(req.body.email || '').trim().toLowerCase();
        if (!nome || !email || !senha || !tipo) {
            return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
        }
        if (!ehEmailValido(email)) {
            return res.status(400).json({ mensagem: 'Informe um e-mail válido.' });
        }
        if (String(senha).length < 6) {
            return res.status(400).json({ mensagem: 'A senha precisa ter pelo menos 6 caracteres.' });
        }
        if (!['atleta', 'empresario'].includes(tipo)) {
            return res.status(400).json({ mensagem: 'Tipo de conta inválido.' });
        }
        const usuarioExiste = await Usuario.findOne({ where: { email } });
        if (usuarioExiste) {
            return res.status(400).json({ mensagem: 'Já existe uma conta com esse e-mail.' });
        }
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada,
            tipo,
        });
        const token = gerarToken(novoUsuario);
        res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso!',
            token,
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                tipo: novoUsuario.tipo,
            },
        });
    }
    catch (erro) {
      console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
    }
};
const login = async (req, res) => {
    try {
        const email = String(req.body.email || '').trim();
        const { senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
        }
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
        }
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
        }
        const token = gerarToken(usuario);
        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
            },
        });
    }
    catch (erro) {
      console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao fazer login.' });
    }
};
module.exports = { registrar, login };
