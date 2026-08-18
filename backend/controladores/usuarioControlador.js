const { Usuario } = require('../modelos');
const buscarMeuUsuario = async (req, res) => {
    const usuario = await Usuario.findByPk(req.usuario.id, {
        attributes: { exclude: ['senha'] },
    });
    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    res.json(usuario);
};
const buscarUsuarioPorId = async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id, {
        attributes: { exclude: ['senha'] },
    });
    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    res.json(usuario);
};
const atualizarMeuUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }
        const { nome, email } = req.body;
        const dadosParaAtualizar = {};
        if (nome)
            dadosParaAtualizar.nome = nome;
        if (email && email !== usuario.email) {
            const emailEmUso = await Usuario.findOne({ where: { email } });
            if (emailEmUso) {
                return res.status(400).json({ mensagem: 'Esse e-mail já está sendo usado por outra conta.' });
            }
            dadosParaAtualizar.email = email;
        }
        await usuario.update(dadosParaAtualizar);
        const { senha, ...dadosSemSenha } = usuario.toJSON();
        res.json({ mensagem: 'Dados atualizados com sucesso!', usuario: dadosSemSenha });
    }
    catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário.', erro: erro.message });
    }
};
const excluirMinhaConta = async (req, res) => {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    await usuario.destroy();
    res.json({ mensagem: 'Conta excluída com sucesso.' });
};
module.exports = {
    buscarMeuUsuario,
    buscarUsuarioPorId,
    atualizarMeuUsuario,
    excluirMinhaConta,
};
