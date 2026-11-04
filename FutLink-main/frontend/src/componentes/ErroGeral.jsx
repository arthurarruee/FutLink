import { Component } from 'react';

// "Error Boundary": se qualquer componente lançar um erro ao desenhar a tela, o React normalmente
// desmonta TUDO e deixa a página em branco. Este componente captura o erro e mostra uma mensagem
// com botão de recarregar. (Foi exatamente isso que faltou no bug do perfil do atleta.)
// Precisa ser uma classe: o React ainda não oferece essa função em componentes de função.
export default class ErroGeral extends Component {
    state = { erro: null };

    static getDerivedStateFromError(erro) {
        return { erro };
    }

    componentDidCatch(erro, info) {
        console.error('Erro ao desenhar a tela:', erro, info?.componentStack);
    }

    render() {
        if (!this.state.erro) return this.props.children;
        return (<div className="pagina">
        <div className="container container-estreito">
          <div className="cartao estado-centro">
            <h2>Algo deu errado por aqui</h2>
            <p>Não conseguimos mostrar esta tela. Tente recarregar a página.</p>
            <div className="estado-acoes">
              <button className="botao botao-primario" onClick={() => window.location.reload()}>
                Recarregar página
              </button>
              <a className="botao botao-secundario" href="/">Ir para o início</a>
            </div>
          </div>
        </div>
      </div>);
    }
}
