const express = require('express');
const router = express.Router();
const verificarLogin = require('../seguranca/autenticacao');
const verificarAdmin = require('../seguranca/admin');
const { listarVerificacoes, baixarDocumento, decidir } = require('../controladores/adminControlador');

// Todas exigem login E ser administrador (ADMIN_EMAILS).
router.get('/verificacoes', verificarLogin, verificarAdmin, listarVerificacoes);
router.get('/verificacoes/:usuarioId/documento', verificarLogin, verificarAdmin, baixarDocumento);
router.put('/verificacoes/:usuarioId', verificarLogin, verificarAdmin, decidir);

module.exports = router;
