const express = require('express');
const router = express.Router();
const verificarLogin = require('../seguranca/autenticacao');
const { listarMeusMatches } = require('../controladores/matchControlador');

router.get('/', verificarLogin, listarMeusMatches);

module.exports = router;
