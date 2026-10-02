const express = require('express');
const router = express.Router();
const verificarLogin = require('../seguranca/autenticacao');
const { criarPerfil, atualizarPerfil, buscarMeuPerfil, buscarPerfilCompleto, } = require('../controladores/perfilEmpresarioControlador');
router.get('/me', verificarLogin, buscarMeuPerfil);
router.post('/', verificarLogin, criarPerfil);
router.put('/', verificarLogin, atualizarPerfil);
router.get('/usuario/:usuarioId', verificarLogin, buscarPerfilCompleto);
module.exports = router;
