const express = require('express');
const router = express.Router();
const verificarLogin = require('../seguranca/autenticacao');
const {
  enviarInteresse,
  listarRecebidos,
  listarEnviados,
  aceitarInteresse,
  recusarInteresse,
  consultarStatus,
} = require('../controladores/interesseControlador');

router.post('/', verificarLogin, enviarInteresse);
router.get('/recebidos', verificarLogin, listarRecebidos);
router.get('/enviados', verificarLogin, listarEnviados);
router.get('/status/:atletaId', verificarLogin, consultarStatus);
router.put('/:id/aceitar', verificarLogin, aceitarInteresse);
router.put('/:id/recusar', verificarLogin, recusarInteresse);

module.exports = router;
