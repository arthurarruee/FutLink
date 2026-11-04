require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { conectarBanco } = require('./configuracao/banco');
const protegerRotas = require('./utilitarios/protegerRotas');
const autenticacaoRotas = require('./rotas/autenticacaoRotas');
const usuarioRotas = require('./rotas/usuarioRotas');
const perfilAtletaRotas = require('./rotas/perfilAtletaRotas');
const perfilEmpresarioRotas = require('./rotas/perfilEmpresarioRotas');
const portfolioRotas = require('./rotas/portfolioRotas');
const interesseRotas = require('./rotas/interesseRotas');
const matchRotas = require('./rotas/matchRotas');
const mensagemRotas = require('./rotas/mensagemRotas');
const historicoClubeRotas = require('./rotas/historicoClubeRotas');
const historicoCompeticaoRotas = require('./rotas/historicoCompeticaoRotas');

// Sem JWT_SECRET o login não funciona (e um segredo fraco permite forjar tokens).
// Melhor falhar logo na inicialização, com uma mensagem clara nos Logs do Render.
if (!process.env.JWT_SECRET) {
    console.error('❌ Variável JWT_SECRET não definida. Configure em Environment no Render.');
    process.exit(1);
}

conectarBanco();
const app = express();

// CORS: quem pode chamar a API pelo navegador.
// Se FRONTEND_URL estiver definida (ex.: https://futlink-front.onrender.com), só esse site é aceito.
// Se não estiver, continua liberado para todos (como era antes), então nada quebra.
const origensPermitidas = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origem) => origem.trim().replace(/\/$/, ''))
    .filter(Boolean);
app.use(cors(origensPermitidas.length ? { origin: origensPermitidas } : undefined));
app.use(express.json({ limit: '100kb' }));

app.get('/', (req, res) => {
    res.json({ mensagem: 'API do FutLink está rodando 🚀' });
});
// Rota simples para o Render (ou você) verificar se a API está de pé.
app.get('/saude', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', protegerRotas(autenticacaoRotas));
app.use('/api/usuarios', protegerRotas(usuarioRotas));
app.use('/api/perfil-atleta', protegerRotas(perfilAtletaRotas));
app.use('/api/perfil-empresario', protegerRotas(perfilEmpresarioRotas));
app.use('/api/portfolio', protegerRotas(portfolioRotas));
app.use('/api/interesses', protegerRotas(interesseRotas));
app.use('/api/matches', protegerRotas(matchRotas));
app.use('/api/mensagens', protegerRotas(mensagemRotas));
app.use('/api/historico-clubes', protegerRotas(historicoClubeRotas));
app.use('/api/historico-competicoes', protegerRotas(historicoCompeticaoRotas));

// Rota que não existe -> 404 em JSON (em vez da página HTML padrão do Express).
app.use((req, res) => {
    res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

// Middleware de erros: recebe os erros enviados por protegerRotas e responde sempre.
// O detalhe técnico vai só para o Log do servidor, não para o usuário.
// eslint-disable-next-line no-unused-vars
app.use((erro, req, res, next) => {
    if (res.headersSent) return;
    // JSON malformado enviado por quem chamou a API: erro de quem enviou (400), não do servidor.
    if (erro.type === 'entity.parse.failed') {
        return res.status(400).json({ mensagem: 'Os dados enviados são inválidos.' });
    }
    if (erro.type === 'entity.too.large') {
        return res.status(413).json({ mensagem: 'Os dados enviados são grandes demais.' });
    }
    console.error('❌ Erro não tratado:', erro);
    res.status(500).json({ mensagem: 'Erro interno do servidor. Tente novamente em instantes.' });
});

const PORTA = process.env.PORT || 5000;
app.listen(PORTA, () => {
    console.log(`✅ Servidor rodando na porta ${PORTA}`);
});
