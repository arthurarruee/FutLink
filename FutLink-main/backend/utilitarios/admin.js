// QUEM É ADMINISTRADOR?
// Não mexemos na tabela de usuários (para não arriscar os dados atuais). Em vez disso, o
// administrador é definido por uma variável de ambiente no servidor:
//   ADMIN_EMAILS=email1@exemplo.com,email2@exemplo.com
// Só quem controla o servidor (você, no painel do Render) consegue dar poder de administrador.
const listaAdmins = () =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const ehAdmin = (email) => listaAdmins().includes(String(email || '').trim().toLowerCase());

module.exports = { ehAdmin };
