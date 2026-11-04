import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
import { IconeChat, IconeOlho } from './Icones';
export default function BarraNavegacao() {
    const { usuario, sair } = useAutenticacao();
    const navegar = useNavigate();
    // No celular os links ficam escondidos atrás do botão "☰" (menuAberto controla isso).
    const [menuAberto, setMenuAberto] = useState(false);
    const fechar = () => setMenuAberto(false);
    const aoSair = () => {
        fechar();
        sair();
        navegar('/login');
    };
    return (<header className="barra-navegacao">
      <div className="container barra-navegacao-conteudo">
        <Link to="/" className="barra-navegacao-logo" onClick={fechar}>
          Fut<span>Link</span>
        </Link>

        <button type="button" className="barra-navegacao-toggle" aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuAberto} onClick={() => setMenuAberto((aberto) => !aberto)}>
          {menuAberto ? '✕' : '☰'}
        </button>

        <nav className={`barra-navegacao-links ${menuAberto ? 'aberto' : ''}`} onClick={(e) => e.target.closest('a') && fechar()}>
          {usuario ? (<>
              {usuario.tipo === 'atleta' && <NavLink to="/feed">Meu feed</NavLink>}
              {usuario.tipo === 'empresario' && <NavLink to="/pesquisa">Pesquisar atletas</NavLink>}
              <NavLink to="/interesses">Interesses</NavLink>
              <NavLink to="/mensagens" className="link-com-icone">
                <IconeChat /> Mensagens
              </NavLink>
              <NavLink to="/perfil" className="link-com-icone">
                <IconeOlho /> Meu perfil
              </NavLink>
              <button className="botao botao-secundario" onClick={aoSair}>
                Sair
              </button>
            </>) : (<>
              <NavLink to="/login">Entrar</NavLink>
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
        .barra-navegacao-logo span { color: var(--verde-luz); }
        .barra-navegacao-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .barra-navegacao-links a:not(.botao) {
          color: var(--branco-gelo);
          font-weight: 500;
          font-size: 0.95rem;
          padding: 6px 0;
          border-bottom: 2px solid transparent;
        }
        .barra-navegacao-links a:not(.botao):hover { color: var(--verde-luz); }
        .barra-navegacao-links a.active:not(.botao) {
          color: var(--verde-luz);
          border-bottom-color: var(--verde-grama);
        }
        .link-com-icone { display: inline-flex; align-items: center; gap: 6px; }
        .barra-navegacao-toggle {
          display: none;
          background: transparent;
          border: 1px solid var(--borda-sutil);
          color: var(--branco-gelo);
          border-radius: 8px;
          width: 44px;
          height: 44px;
          font-size: 1.2rem;
          cursor: pointer;
        }
        @media (max-width: 860px) {
          .barra-navegacao-toggle { display: inline-flex; align-items: center; justify-content: center; }
          .barra-navegacao-links {
            display: none;
            position: absolute;
            top: 72px;
            left: 0;
            right: 0;
            flex-direction: column;
            align-items: stretch;
            gap: 4px;
            padding: 16px 24px 24px;
            background-color: var(--preto-cartao);
            border-bottom: 1px solid var(--borda-sutil);
          }
          .barra-navegacao-links.aberto { display: flex; }
          .barra-navegacao-links a:not(.botao) { padding: 12px 0; border-bottom: 1px solid var(--borda-sutil); }
          .barra-navegacao-links .botao { margin-top: 12px; }
        }
      `}</style>
    </header>);
}
