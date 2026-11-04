import { Link } from 'react-router-dom';
export default function NaoEncontrada() {
    return (<div className="pagina">
      <div className="container container-estreito">
        <div className="cartao estado-centro">
          <p className="eyebrow-auth">Erro 404</p>
          <h2>Página não encontrada</h2>
          <p>O endereço que você abriu não existe ou foi movido.</p>
          <div className="estado-acoes">
            <Link to="/" className="botao botao-primario">Voltar ao início</Link>
          </div>
        </div>
      </div>
    </div>);
}
