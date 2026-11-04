// Pequenos componentes reutilizáveis para os 3 estados que toda tela com dados precisa ter:
// carregando, vazio e erro. Assim todas as páginas ficam com o mesmo visual.

export function Carregando({ texto = 'Carregando...' }) {
    return (<div className="estado-carregando" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{texto}</span>
    </div>);
}

export function EstadoVazio({ titulo, texto, children }) {
    return (<div className="cartao estado-centro">
      {titulo && <h3>{titulo}</h3>}
      {texto && <p>{texto}</p>}
      {children}
    </div>);
}

export function MensagemErro({ texto, aoTentarNovamente }) {
    if (!texto) return null;
    return (<div className="mensagem-erro" role="alert">
      {texto}
      {aoTentarNovamente && (<button type="button" className="botao-link-erro" onClick={aoTentarNovamente}>
          Tentar novamente
        </button>)}
    </div>);
}
