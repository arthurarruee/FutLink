const express = require('express');
const router = express.Router();
const verificarLogin = require('../seguranca/autenticacao');
const {
  adicionarClube,
  excluirClube,
  listarMeusClubes,
  listarClubesPorUsuario,
} = require('../controladores/historicoClubeControlador');

router.get('/me', verificarLogin, listarMeusClubes);
router.post('/', verificarLogin, adicionarClube);
router.delete('/:id', verificarLogin, excluirClube);
router.get('/usuario/:usuarioId', verificarLogin, listarClubesPorUsuario);

module.exports = router;
