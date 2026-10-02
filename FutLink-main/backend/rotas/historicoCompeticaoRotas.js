const express = require('express');
const router = express.Router();
const verificarLogin = require('../seguranca/autenticacao');
const {
  adicionarCompeticao,
  excluirCompeticao,
  listarMinhasCompeticoes,
  listarCompeticoesPorUsuario,
} = require('../controladores/historicoCompeticaoControlador');

router.get('/me', verificarLogin, listarMinhasCompeticoes);
router.post('/', verificarLogin, adicionarCompeticao);
router.delete('/:id', verificarLogin, excluirCompeticao);
router.get('/usuario/:usuarioId', verificarLogin, listarCompeticoesPorUsuario);

module.exports = router;
