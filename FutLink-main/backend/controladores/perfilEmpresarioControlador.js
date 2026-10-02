const { Usuario, PerfilEmpresario } = require('../modelos');
const criarPerfil = async (req, res) => {
    try {
        if (req.usuario.tipo !== 'empresario') {
            return res.status(403).json({ mensagem: 'Só empresários podem criar esse tipo de perfil.' });
        }
        const perfilExiste = await PerfilEmpresario.findOne({ where: { usuarioId: req.usuario.id } });
        if (perfilExiste) {
            return res.status(400).json({ mensagem: 'Você já tem um perfil criado. Use editar em vez de criar.' });
        }
        const { empresa, cargo, cidade, estado, biografia, fotoPerfil } = req.body;
        const perfil = await PerfilEmpresario.create({
            usuarioId: req.usuario.id,
            empresa,
            cargo,
            cidade,
            estado,
            biografia,
            fotoPerfil,
        });
        res.status(201).json({ mensagem: 'Perfil de empresário criado com sucesso!', perfil });
    }
    catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao criar perfil.', erro: erro.message });
    }
};
const atualizarPerfil = async (req, res) => {
    try {
        if (req.usuario.tipo !== 'empresario') {
            return res.status(403).json({ mensagem: 'Só empresários podem editar esse tipo de perfil.' });
        }
        const { empresa, cargo, cidade, estado, biografia, fotoPerfil } = req.body;
        const dados = { empresa, cargo, cidade, estado, biografia, fotoPerfil };
        const [perfil] = await PerfilEmpresario.upsert({ usuarioId: req.usuario.id, ...dados });
        res.json({ mensagem: 'Perfil atualizado com sucesso!', perfil });
    }
    catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao atualizar perfil.', erro: erro.message });
    }
};
const buscarMeuPerfil = async (req, res) => {
    const perfil = await PerfilEmpresario.findOne({ where: { usuarioId: req.usuario.id } });
    if (!perfil) {
        return res.status(404).json({ mensagem: 'Você ainda não criou seu perfil de empresário.' });
    }
    res.json(perfil);
};
const buscarPerfilCompleto = async (req, res) => {
    const perfil = await PerfilEmpresario.findOne({
        where: { usuarioId: req.params.usuarioId },
        include: { model: Usuario, attributes: ['id', 'nome', 'email'] },
    });
    if (!perfil) {
        return res.status(404).json({ mensagem: 'Perfil de empresário não encontrado.' });
    }
    res.json(perfil);
};
module.exports = {
    criarPerfil,
    atualizarPerfil,
    buscarMeuPerfil,
    buscarPerfilCompleto,
};
