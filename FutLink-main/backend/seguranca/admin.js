const { Usuario } = require('../modelos');
const { ehAdmin } = require('../utilitarios/admin');

// Usar DEPOIS de verificarLogin. Consulta o e-mail atual no banco (não confia só no token)
// e só deixa passar quem está em ADMIN_EMAILS.
const verificarAdmin = async (req, res, next) => {
  const usuario = await Usuario.findByPk(req.usuario.id, { attributes: ['id', 'email'] });
  if (!usuario || !ehAdmin(usuario.email)) {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores.' });
  }
  next();
};

module.exports = verificarAdmin;
