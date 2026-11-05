import { Link } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
import { IconeBola, IconeEmail, IconeMapa } from './Icones';

// E-mail de contato: configure VITE_CONTATO_EMAIL no Render (Static Site → Environment).
// Se não estiver definido, o e-mail simplesmente não aparece (não inventamos contatos).
const EMAIL_CONTATO = import.meta.env.VITE_CONTATO_EMAIL;

export default function Rodape() {
  const { usuario } = useAutenticacao();
  const ano = new Date().getFullYear();

  return (
    <footer className="rodape">
      <div className="container">
        <div className="rodape-grade">
          <div className="rodape-marca">
            <Link to="/" className="rodape-logo"><IconeBola tamanho={24} /> Fut<span>Link</span></Link>
            <p>
              Plataforma que conecta jogadores de futebol de base a empresários, olheiros e clubes,
              por meio de perfis completos e portfólio em vídeo.
            </p>
          </div>

          <nav aria-label="Plataforma">
            <h4>Plataforma</h4>
            <ul>
              <li><Link to="/">Início</Link></li>
              {usuario?.tipo === 'empresario' && <li><Link to="/pesquisa">Pesquisar atletas</Link></li>}
              {usuario?.tipo === 'atleta' && <li><Link to="/feed">Meu portfólio</Link></li>}
              {usuario && <li><Link to="/interesses">Interesses</Link></li>}
              {usuario && <li><Link to="/mensagens">Mensagens</Link></li>}
              {!usuario && <li><Link to="/cadastro">Criar conta</Link></li>}
              {!usuario && <li><Link to="/login">Entrar</Link></li>}
            </ul>
          </nav>

          <nav aria-label="Ajuda">
            <h4>Ajuda</h4>
            <ul>
              <li><Link to="/ajuda">Central de Ajuda</Link></li>
              <li><Link to="/ajuda#primeiros-passos">Primeiros passos</Link></li>
              <li><Link to="/ajuda#atletas">Para atletas</Link></li>
              <li><Link to="/ajuda#empresarios">Para empresários</Link></li>
              <li><Link to="/ajuda#verificacao">Perfil verificado</Link></li>
            </ul>
          </nav>

          <div>
            <h4>Contato</h4>
            <ul className="rodape-contato">
              {EMAIL_CONTATO && (<li><IconeEmail /> <a href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a></li>)}
              <li><IconeMapa /> Porto Alegre, RS — Brasil</li>
              <li><Link to="/ajuda#contato">Dúvidas? Veja a Central de Ajuda</Link></li>
            </ul>
          </div>
        </div>

        <div className="rodape-base">
          <span>© {ano} FutLink. Todos os direitos reservados.</span>
        </div>
      </div>

      <style>{`
        .rodape { margin-top: 48px; border-top: 1px solid var(--borda-sutil); background: linear-gradient(180deg, transparent, rgba(5, 8, 6, 0.9)); padding: 48px 0 24px; position: relative; }
        .rodape::before { content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--verde-grama), transparent); opacity: .6; }
        .rodape-grade { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.3fr; gap: 40px; }
        .rodape-logo { display: inline-flex; align-items: center; gap: 8px; font-family: var(--fonte-destaque); font-size: 1.35rem; color: var(--branco-gelo); margin-bottom: 14px; }
        .rodape-logo span { color: var(--verde-luz); margin-left: -6px; }
        .rodape-logo svg { color: var(--verde-grama); }
        .rodape-marca p { font-size: 0.9rem; max-width: 340px; }
        .rodape h4 { font-family: var(--fonte-dados); font-size: 0.78rem; text-transform: uppercase; letter-spacing: .08em; color: var(--verde-luz); margin: 0 0 16px; font-weight: 600; }
        .rodape ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .rodape li { font-size: 0.9rem; color: var(--cinza-aco); display: flex; align-items: center; gap: 8px; }
        .rodape li a { color: var(--cinza-aco); }
        .rodape li a:hover { color: var(--verde-luz); }
        .rodape-contato svg { color: var(--verde-grama); flex-shrink: 0; }
        .rodape-base { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--borda-sutil); font-size: 0.82rem; color: var(--cinza-aco); }
        @media (max-width: 860px) { .rodape-grade { grid-template-columns: 1fr 1fr; } .rodape-marca { grid-column: span 2; } }
        @media (max-width: 480px) { .rodape-grade { grid-template-columns: 1fr; } .rodape-marca { grid-column: auto; } }
      `}</style>
    </footer>
  );
}
