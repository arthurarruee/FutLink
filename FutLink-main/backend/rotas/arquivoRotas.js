const express = require('express');
const router = express.Router();
const verificarLogin = require('../seguranca/autenticacao');
const {
  salvarFoto, removerFoto, baixarFoto,
  consultarMinhaComprovacao, enviarComprovacao, removerComprovacao, baixarMinhaComprovacao,
} = require('../controladores/arquivoControlador');

router.put('/foto', verificarLogin, salvarFoto);
router.delete('/foto', verificarLogin, removerFoto);
router.get('/foto/:usuarioId', verificarLogin, baixarFoto);

router.get('/comprovacao/me', verificarLogin, consultarMinhaComprovacao);
router.get('/comprovacao/arquivo', verificarLogin, baixarMinhaComprovacao);
router.put('/comprovacao', verificarLogin, enviarComprovacao);
router.delete('/comprovacao', verificarLogin, removerComprovacao);

module.exports = router;
