const express = require('express');
const router = express.Router();
const verificarLogin = require('../seguranca/autenticacao');
const { buscarMeuUsuario, buscarUsuarioPorId, atualizarMeuUsuario, excluirMinhaConta, } = require('../controladores/usuarioControlador');
router.get('/me', verificarLogin, buscarMeuUsuario);
router.put('/me', verificarLogin, atualizarMeuUsuario);
router.delete('/me', verificarLogin, excluirMinhaConta);
router.get('/:id', verificarLogin, buscarUsuarioPorId);
module.exports = router;
