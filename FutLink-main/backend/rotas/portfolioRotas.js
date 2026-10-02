const express = require('express');
const router = express.Router();
const verificarLogin = require('../seguranca/autenticacao');
const {
  adicionarVideo,
  editarVideo,
  excluirVideo,
  listarMeusVideos,
  listarVideosPorUsuario,
} = require('../controladores/portfolioControlador');

router.get('/me', verificarLogin, listarMeusVideos);
router.post('/', verificarLogin, adicionarVideo);
router.put('/:id', verificarLogin, editarVideo);
router.delete('/:id', verificarLogin, excluirVideo);
router.get('/usuario/:usuarioId', verificarLogin, listarVideosPorUsuario);

module.exports = router;
