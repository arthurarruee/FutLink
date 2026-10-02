const { Op } = require('sequelize');
const { Usuario, PerfilAtleta } = require('../modelos');
const criarPerfil = async (req, res) => {
    try {
        if (req.usuario.tipo !== 'atleta') {
            return res.status(403).json({ mensagem: 'Só atletas podem criar esse tipo de perfil.' });
        }
        const perfilExiste = await PerfilAtleta.findOne({ where: { usuarioId: req.usuario.id } });
        if (perfilExiste) {
            return res.status(400).json({ mensagem: 'Você já tem um perfil criado. Use editar em vez de criar.' });
        }
        const { idade, posicao, pePreferido, clubeAtual, cidade, estado, biografia, fotoPerfil } = req.body;
        const perfil = await PerfilAtleta.create({
            usuarioId: req.usuario.id,
            idade,
            posicao,
            pePreferido,
            clubeAtual,
            cidade,
            estado,
            biografia,
            fotoPerfil,
        });
        res.status(201).json({ mensagem: 'Perfil de atleta criado com sucesso!', perfil });
    }
    catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao criar perfil.', erro: erro.message });
    }
};
const atualizarPerfil = async (req, res) => {
    try {
        if (req.usuario.tipo !== 'atleta') {
            return res.status(403).json({ mensagem: 'Só atletas podem editar esse tipo de perfil.' });
        }
        const { idade, posicao, pePreferido, clubeAtual, cidade, estado, biografia, fotoPerfil } = req.body;
        const dados = { idade, posicao, pePreferido, clubeAtual, cidade, estado, biografia, fotoPerfil };
        const [perfil] = await PerfilAtleta.upsert({ usuarioId: req.usuario.id, ...dados });
        res.json({ mensagem: 'Perfil atualizado com sucesso!', perfil });
    }
    catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao atualizar perfil.', erro: erro.message });
    }
};
const buscarMeuPerfil = async (req, res) => {
    const perfil = await PerfilAtleta.findOne({ where: { usuarioId: req.usuario.id } });
    if (!perfil) {
        return res.status(404).json({ mensagem: 'Você ainda não criou seu perfil de atleta.' });
    }
    res.json(perfil);
};
const buscarPerfilCompleto = async (req, res) => {
    const perfil = await PerfilAtleta.findOne({
        where: { usuarioId: req.params.usuarioId },
        include: { model: Usuario, attributes: ['id', 'nome', 'email'] },
    });
    if (!perfil) {
        return res.status(404).json({ mensagem: 'Perfil de atleta não encontrado.' });
    }
    res.json(perfil);
};
const listarAtletas = async (req, res) => {
    try {
        const { nome, posicao, cidade, estado, idadeMin, idadeMax } = req.query;
        const filtroPerfil = {};
        if (posicao)
            filtroPerfil.posicao = posicao;
        if (cidade)
            filtroPerfil.cidade = cidade;
        if (estado)
            filtroPerfil.estado = estado;
        if (idadeMin || idadeMax) {
            filtroPerfil.idade = {};
            if (idadeMin)
                filtroPerfil.idade[Op.gte] = Number(idadeMin);
            if (idadeMax)
                filtroPerfil.idade[Op.lte] = Number(idadeMax);
        }
        const filtroUsuario = { tipo: 'atleta' };
        if (nome)
            filtroUsuario.nome = { [Op.like]: `%${nome}%` };
        const atletas = await PerfilAtleta.findAll({
            where: filtroPerfil,
            include: {
                model: Usuario,
                attributes: ['id', 'nome', 'email'],
                where: filtroUsuario,
            },
        });
        res.json(atletas);
    }
    catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao listar atletas.', erro: erro.message });
    }
};
module.exports = {
    criarPerfil,
    atualizarPerfil,
    buscarMeuPerfil,
    buscarPerfilCompleto,
    listarAtletas,
};
