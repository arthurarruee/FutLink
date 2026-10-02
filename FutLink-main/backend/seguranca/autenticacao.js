const jwt = require('jsonwebtoken');
const verificarLogin = (req, res, next) => {
    const cabecalhoAutorizacao = req.headers.authorization;
    if (!cabecalhoAutorizacao || !cabecalhoAutorizacao.startsWith('Bearer ')) {
        return res.status(401).json({ mensagem: 'Acesso negado. Faça login para continuar.' });
    }
    const token = cabecalhoAutorizacao.split(' ')[1];
    try {
        const dadosToken = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = dadosToken;
        next();
    }
    catch (erro) {
        return res.status(401).json({ mensagem: 'Token inválido ou expirado. Faça login novamente.' });
    }
};
module.exports = verificarLogin;
