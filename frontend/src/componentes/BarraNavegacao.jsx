import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
export default function BarraNavegacao() {
    const { usuario, sair } = useAutenticacao();
    const navegar = useNavigate();
    const aoSair = () => {
        sair();
        navegar('/login');
    };
    return (<header className="barra-navegacao">
      <div className="container barra-navegacao-conteudo">
        <Link to="/" className="barra-navegacao-logo">
          Fut<span>Link</span>
        </Link>

        <nav className="barra-navegacao-links">
          {usuario ? (<>
              {usuario.tipo === 'atleta' && <Link to="/feed">Meu feed</Link>}
              {usuario.tipo === 'empresario' && <Link to="/pesquisa">Pesquisar atletas</Link>}
              <Link to="/interesses">Interesses</Link>
              <Link to="/mensagens">Mensagens</Link>
              <Link to="/perfil">Meu perfil</Link>
              <button className="botao botao-secundario" onClick={aoSair}>
                Sair
              </button>
            </>) : (<>
              <Link to="/login">Entrar</Link>
              <Link to="/cadastro" className="botao botao-primario">
                Criar conta
              </Link>
            </>)}
        </nav>
      </div>

      <style>{`
        .barra-navegacao {
          border-bottom: 1px solid var(--borda-sutil);
          background-color: rgba(11, 15, 13, 0.85);
          backdrop-filter: blur(6px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .barra-navegacao-conteudo {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .barra-navegacao-logo {
          font-family: var(--fonte-destaque);
          font-size: 1.4rem;
          color: var(--branco-gelo);
        }
        .barra-navegacao-logo span {
          color: var(--verde-luz);
        }
        .barra-navegacao-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .barra-navegacao-links a {
          color: var(--branco-gelo);
          font-weight: 500;
          font-size: 0.95rem;
        }
        .barra-navegacao-links a:hover {
          color: var(--verde-luz);
        }
      `}</style>
    </header>);
}
