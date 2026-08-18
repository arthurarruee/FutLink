const express = require('express');
const router = express.Router();
const verificarLogin = require('../seguranca/autenticacao');
const { enviarMensagem, listarConversa, excluirMensagem } = require('../controladores/mensagemControlador');

router.post('/', verificarLogin, enviarMensagem);
router.get('/:usuarioId', verificarLogin, listarConversa);
router.delete('/:id', verificarLogin, excluirMensagem);

module.exports = router;
