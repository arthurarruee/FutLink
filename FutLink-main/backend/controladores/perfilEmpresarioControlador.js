const { Usuario, PerfilEmpresario, Verificacao } = require('../modelos');
const { limparTexto, temCampo } = require('../utilitarios/validacao');

const CAMPOS_TEXTO = ['empresa', 'cargo', 'cidade', 'estado', 'biografia', 'fotoPerfil'];

const montarDadosPerfil = (corpo) => {
    const dados = {};
    for (const campo of CAMPOS_TEXTO) {
        if (temCampo(corpo, campo)) dados[campo] = limparTexto(corpo[campo]);
    }
    if (dados.estado) {
        dados.estado = dados.estado.toUpperCase();
        if (!/^[A-Z]{2}$/.test(dados.estado)) return { erro: 'Use a sigla do estado com 2 letras (ex.: RS).' };
    }
    if (dados.biografia && dados.biografia.length > 500) {
        return { erro: 'A biografia pode ter no máximo 500 caracteres.' };
    }
    for (const campo of ['empresa', 'cargo', 'cidade', 'fotoPerfil']) {
        if (dados[campo] && dados[campo].length > 255) return { erro: `O campo ${campo} está longo demais.` };
    }
    return { dados };
};

const buscarPerfilDoUsuario = (usuarioId, opcoes = {}) =>
    PerfilEmpresario.findOne({ where: { usuarioId }, order: [['id', 'DESC']], ...opcoes });

const criarPerfil = async (req, res) => {
    try {
        if (req.usuario.tipo !== 'empresario') {
            return res.status(403).json({ mensagem: 'Só empresários podem criar esse tipo de perfil.' });
        }
        const perfilExiste = await buscarPerfilDoUsuario(req.usuario.id);
        if (perfilExiste) {
            return res.status(400).json({ mensagem: 'Você já tem um perfil criado. Use editar em vez de criar.' });
        }
        const { dados, erro } = montarDadosPerfil(req.body);
        if (erro) return res.status(400).json({ mensagem: erro });
        const perfil = await PerfilEmpresario.create({ usuarioId: req.usuario.id, ...dados });
        res.status(201).json({ mensagem: 'Perfil de empresário criado com sucesso!', perfil });
    }
    catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar perfil.' });
    }
};

// Mesma correção do perfil de atleta: procura e atualiza (ou cria), em vez de upsert().
const atualizarPerfil = async (req, res) => {
    try {
        if (req.usuario.tipo !== 'empresario') {
            return res.status(403).json({ mensagem: 'Só empresários podem editar esse tipo de perfil.' });
        }
        const { dados, erro } = montarDadosPerfil(req.body);
        if (erro) return res.status(400).json({ mensagem: erro });

        let perfil = await buscarPerfilDoUsuario(req.usuario.id);
        if (perfil) {
            await perfil.update(dados);
        }
        else {
            perfil = await PerfilEmpresario.create({ usuarioId: req.usuario.id, ...dados });
        }
        res.json({ mensagem: 'Perfil atualizado com sucesso!', perfil });
    }
    catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao atualizar perfil.' });
    }
};

const buscarMeuPerfil = async (req, res) => {
    const perfil = await buscarPerfilDoUsuario(req.usuario.id);
    if (!perfil) {
        return res.status(404).json({ mensagem: 'Você ainda não criou seu perfil de empresário.' });
    }
    res.json(perfil);
};

const buscarPerfilCompleto = async (req, res) => {
    const perfil = await buscarPerfilDoUsuario(req.params.usuarioId, {
        include: {
            model: Usuario,
            attributes: ['id', 'nome', 'email'],
            include: [{ model: Verificacao, attributes: ['status'], where: { status: 'aprovado' }, required: false }],
        },
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
