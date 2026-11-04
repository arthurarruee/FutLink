// PROBLEMA QUE ISSO RESOLVE
// No Express 4, se uma função "async" de uma rota lançar um erro (ex.: o banco caiu) e ela
// não tiver try/catch, o erro se perde e a requisição NUNCA recebe resposta.
// No navegador isso aparece como "carregando para sempre" / tela em branco.
//
// Esta função percorre as rotas de um router e "embrulha" cada handler para que qualquer erro
// seja enviado ao middleware de erros do servidor.js, que responde com um JSON de erro 500.
const protegerRotas = (router) => {
  router.stack.forEach((camada) => {
    if (!camada.route) return;
    camada.route.stack.forEach((camadaRota) => {
      const original = camadaRota.handle;
      if (original.length >= 4) return; // middlewares de erro ficam como estão
      camadaRota.handle = (req, res, next) => {
        Promise.resolve(original(req, res, next)).catch(next);
      };
    });
  });
  return router;
};

module.exports = protegerRotas;
