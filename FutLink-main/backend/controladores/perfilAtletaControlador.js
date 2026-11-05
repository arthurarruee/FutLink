const { Op } = require('sequelize');
const { Usuario, PerfilAtleta } = require('../modelos');
const { limparTexto, temCampo } = require('../utilitarios/validacao');
const { lerFiltrosAtleta, filtrosParaWhere, posicaoCanonica, escaparLike } = require('../utilitarios/filtrosAtleta');

const PES_VALIDOS = ['Direito', 'Esquerdo', 'Ambidestro'];
const CAMPOS_TEXTO = ['posicao', 'clubeAtual', 'cidade', 'estado', 'biografia', 'fotoPerfil'];

// Lê o corpo da requisição, limpa e valida. Devolve { dados } ou { erro }.
// Só inclui os campos que realmente vieram na requisição (campo ausente = não mexe no que já existe).
const montarDadosPerfil = (corpo) => {
    const dados = {};
    for (const campo of CAMPOS_TEXTO) {
        if (temCampo(corpo, campo)) dados[campo] = limparTexto(corpo[campo]);
    }
    // "Meia" / "meio campo" passam a ser guardados como "Meio-campo", igual às opções da tela.
    if (dados.posicao) dados.posicao = posicaoCanonica(dados.posicao);
    if (temCampo(corpo, 'pePreferido')) dados.pePreferido = limparTexto(corpo.pePreferido);
    if (temCampo(corpo, 'idade')) {
        const idade = limparTexto(corpo.idade);
        dados.idade = idade === null ? null : Number(idade);
    }

    if (dados.idade !== undefined && dados.idade !== null && (!Number.isInteger(dados.idade) || dados.idade < 10 || dados.idade > 60)) {
        return { erro: 'Informe uma idade válida (entre 10 e 60 anos).' };
    }
    if (dados.pePreferido && !PES_VALIDOS.includes(dados.pePreferido)) {
        return { erro: 'Pé dominante inválido.' };
    }
    if (dados.estado) {
        dados.estado = dados.estado.toUpperCase();
        if (!/^[A-Z]{2}$/.test(dados.estado)) return { erro: 'Use a sigla do estado com 2 letras (ex.: RS).' };
    }
    if (dados.biografia && dados.biografia.length > 500) {
        return { erro: 'A biografia pode ter no máximo 500 caracteres.' };
    }
    for (const campo of ['posicao', 'clubeAtual', 'cidade', 'fotoPerfil']) {
        if (dados[campo] && dados[campo].length > 255) return { erro: `O campo ${campo} está longo demais.` };
    }
    return { dados };
};

// Se por algum motivo existirem várias linhas do mesmo usuário (versões antigas do código
// podiam duplicar ao salvar), sempre usamos a mais recente.
const buscarPerfilDoUsuario = (usuarioId, opcoes = {}) =>
    PerfilAtleta.findOne({ where: { usuarioId }, order: [['id', 'DESC']], ...opcoes });

const criarPerfil = async (req, res) => {
    try {
        if (req.usuario.tipo !== 'atleta') {
            return res.status(403).json({ mensagem: 'Só atletas podem criar esse tipo de perfil.' });
        }
        const perfilExiste = await buscarPerfilDoUsuario(req.usuario.id);
        if (perfilExiste) {
            return res.status(400).json({ mensagem: 'Você já tem um perfil criado. Use editar em vez de criar.' });
        }
        const { dados, erro } = montarDadosPerfil(req.body);
        if (erro) return res.status(400).json({ mensagem: erro });
        const perfil = await PerfilAtleta.create({ usuarioId: req.usuario.id, ...dados });
        res.status(201).json({ mensagem: 'Perfil de atleta criado com sucesso!', perfil });
    }
    catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar perfil.' });
    }
};

// ANTES: usava upsert(). Como a coluna usuarioId não é UNIQUE no banco, o upsert inseria uma
// linha nova a cada "Salvar" em vez de atualizar. Agora: procura; se existe atualiza, senão cria.
const atualizarPerfil = async (req, res) => {
    try {
        if (req.usuario.tipo !== 'atleta') {
            return res.status(403).json({ mensagem: 'Só atletas podem editar esse tipo de perfil.' });
        }
        const { dados, erro } = montarDadosPerfil(req.body);
        if (erro) return res.status(400).json({ mensagem: erro });

        let perfil = await buscarPerfilDoUsuario(req.usuario.id);
        if (perfil) {
            await perfil.update(dados);
        }
        else {
            perfil = await PerfilAtleta.create({ usuarioId: req.usuario.id, ...dados });
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
        return res.status(404).json({ mensagem: 'Você ainda não criou seu perfil de atleta.' });
    }
    res.json(perfil);
};

const buscarPerfilCompleto = async (req, res) => {
    const perfil = await buscarPerfilDoUsuario(req.params.usuarioId, {
        include: { model: Usuario, attributes: ['id', 'nome', 'email'] },
    });
    if (!perfil) {
        return res.status(404).json({ mensagem: 'Perfil de atleta não encontrado.' });
    }
    res.json(perfil);
};

const listarAtletas = async (req, res) => {
    // A pesquisa de atletas é uma ferramenta do empresário/olheiro.
    if (req.usuario.tipo !== 'empresario') {
        return res.status(403).json({ mensagem: 'Só empresários podem pesquisar atletas.' });
    }
    try {
        // Posição, cidade, estado e idade são lidos/validados em um só lugar (utilitarios/filtrosAtleta.js)
        // e funcionam sozinhos ou combinados (todos os filtros informados precisam ser atendidos).
        const { filtros, erro } = lerFiltrosAtleta(req.query);
        if (erro) {
            return res.status(400).json({ mensagem: erro });
        }
        const { nome } = req.query;
        const filtroPerfil = filtrosParaWhere(filtros);
        const filtroUsuario = { tipo: 'atleta' };
        if (nome)
            filtroUsuario.nome = { [Op.like]: `%${escaparLike(nome)}%` };
        const atletas = await PerfilAtleta.findAll({
            where: filtroPerfil,
            include: {
                model: Usuario,
                attributes: ['id', 'nome', 'email'],
                where: filtroUsuario,
            },
            order: [['id', 'DESC']],
        });
        // Remove duplicados (mesmo usuário aparecendo mais de uma vez), mantendo o mais recente.
        const vistos = new Set();
        const unicos = atletas.filter((perfil) => {
            if (vistos.has(perfil.usuarioId)) return false;
            vistos.add(perfil.usuarioId);
            return true;
        });
        res.json(unicos);
    }
    catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao listar atletas.' });
    }
};

module.exports = {
    criarPerfil,
    atualizarPerfil,
    buscarMeuPerfil,
    buscarPerfilCompleto,
    listarAtletas,
};
