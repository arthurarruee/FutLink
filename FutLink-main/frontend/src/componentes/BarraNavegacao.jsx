import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
import Avatar from './Avatar';
import { IconeAjuda, IconeBola, IconeBusca, IconeChat, IconeEscudo, IconeEstrela, IconeSair, IconeUsuario, IconeVideo } from './Icones';

export default function BarraNavegacao() {
  const { usuario, sair } = useAutenticacao();
  const navegar = useNavigate();
  const local = useLocation();
  const [menuAberto, setMenuAberto] = useState(false); // painel de links no celular
  const [contaAberta, setContaAberta] = useState(false); // menu do avatar
  const contaRef = useRef(null);

  // Fecha os menus ao trocar de página ou ao clicar fora do menu da conta.
  useEffect(() => {
    setMenuAberto(false);
    setContaAberta(false);
  }, [local.pathname]);
  useEffect(() => {
    const aoClicarFora = (evento) => {
      if (contaRef.current && !contaRef.current.contains(evento.target)) setContaAberta(false);
    };
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, []);

  const aoSair = () => {
    sair();
    navegar('/login');
  };

  return (
    <header className="cabecalho">
      <div className="container cabecalho-conteudo">
        <Link to="/" className="cabecalho-logo" aria-label="FutLink — página inicial">
          <span className="cabecalho-logo-icone"><IconeBola tamanho={22} /></span>
          <span>Fut<em>Link</em></span>
        </Link>

        <button type="button" className="cabecalho-toggle" aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuAberto} onClick={() => setMenuAberto((aberto) => !aberto)}>
          <span /><span /><span />
        </button>

        <nav className={`cabecalho-nav ${menuAberto ? 'aberto' : ''}`} aria-label="Principal">
          <div className="cabecalho-links">
            {usuario?.tipo === 'empresario' && <NavLink to="/pesquisa"><IconeBusca tamanho={17} /> Pesquisar</NavLink>}
            {usuario?.tipo === 'atleta' && <NavLink to="/feed"><IconeVideo tamanho={17} /> Meu feed</NavLink>}
            {usuario && <NavLink to="/interesses"><IconeEstrela tamanho={17} /> Interesses</NavLink>}
            {usuario && <NavLink to="/mensagens"><IconeChat tamanho={17} /> Matches</NavLink>}
            <NavLink to="/ajuda"><IconeAjuda tamanho={17} /> Ajuda</NavLink>
            {usuario?.admin && <NavLink to="/admin" className="link-admin"><IconeEscudo tamanho={17} /> Admin</NavLink>}
          </div>

          <div className="cabecalho-conta" ref={contaRef}>
            {usuario ? (
              <>
                <button type="button" className="conta-botao" aria-haspopup="menu" aria-expanded={contaAberta} onClick={() => setContaAberta((aberta) => !aberta)}>
                  <Avatar usuarioId={usuario.id} nome={usuario.nome} tamanho={36} />
                  <span className="conta-nome">{usuario.nome.split(' ')[0]}</span>
                  <span className="conta-seta" aria-hidden="true">▾</span>
                </button>
                {/* No celular, as ações da conta aparecem direto no painel (sem dropdown). */}
                <div className={`conta-menu ${contaAberta ? 'aberto' : ''}`} role="menu">
                  <div className="conta-menu-topo">
                    <strong>{usuario.nome}</strong>
                    <span>{usuario.admin ? 'Administrador' : usuario.tipo === 'atleta' ? 'Atleta' : 'Empresário / Olheiro'}</span>
                  </div>
                  <Link to="/perfil" role="menuitem"><IconeUsuario tamanho={17} /> Meu perfil</Link>
                  <button type="button" role="menuitem" onClick={aoSair}><IconeSair tamanho={17} /> Sair</button>
                </div>
              </>
            ) : (
              <div className="cabecalho-visitante">
                <Link to="/login" className="botao botao-secundario botao-pequeno">Entrar</Link>
                <Link to="/cadastro" className="botao botao-primario botao-pequeno">Criar conta</Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <style>{`
        .cabecalho { position: sticky; top: 0; z-index: 50; background: rgba(8, 12, 10, 0.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--borda-sutil); }
        .cabecalho::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px; background: linear-gradient(90deg, transparent, rgba(63, 145, 66, 0.7), transparent); }
        .cabecalho-conteudo { height: var(--altura-cabecalho); display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .cabecalho-logo { display: inline-flex; align-items: center; gap: 10px; font-family: var(--fonte-destaque); font-size: 1.45rem; color: var(--branco-gelo); flex-shrink: 0; }
        .cabecalho-logo em { font-style: normal; color: var(--verde-luz); }
        .cabecalho-logo-icone { width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; color: #06100a; background: linear-gradient(135deg, var(--verde-neon), var(--verde-grama)); box-shadow: 0 4px 14px rgba(63, 145, 66, 0.4); }
        .cabecalho-nav { display: flex; align-items: center; justify-content: space-between; flex: 1; gap: 24px; }
        .cabecalho-links { display: flex; align-items: center; gap: 4px; margin-left: 16px; }
        .cabecalho-links a { display: inline-flex; align-items: center; gap: 7px; padding: 9px 13px; border-radius: 9px; color: var(--cinza-aco); font-weight: 500; font-size: 0.92rem; transition: background .15s, color .15s; }
        .cabecalho-links a:hover { color: var(--branco-gelo); background: rgba(242, 245, 241, 0.05); }
        .cabecalho-links a.active { color: var(--verde-neon); background: rgba(63, 145, 66, 0.14); }
        .cabecalho-links a.link-admin { color: var(--ouro); }
        .cabecalho-links a.link-admin.active { background: rgba(233, 196, 106, 0.12); color: var(--ouro); }
        .cabecalho-conta { position: relative; }
        .cabecalho-visitante { display: flex; gap: 10px; }
        .conta-botao { display: inline-flex; align-items: center; gap: 10px; padding: 5px 12px 5px 5px; border-radius: 999px; background: rgba(242, 245, 241, 0.04); border: 1px solid var(--borda-sutil); color: var(--branco-gelo); font-family: var(--fonte-corpo); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: border-color .15s; }
        .conta-botao:hover { border-color: var(--verde-grama); }
        .conta-seta { font-size: 0.7rem; color: var(--cinza-aco); }
        .conta-menu { display: none; position: absolute; right: 0; top: calc(100% + 10px); min-width: 230px; padding: 8px; border-radius: 14px; background: var(--preto-cartao); border: 1px solid var(--borda-forte); box-shadow: var(--sombra-cartao); }
        .conta-menu.aberto { display: block; }
        .conta-menu-topo { padding: 10px 12px 12px; margin-bottom: 6px; border-bottom: 1px solid var(--borda-sutil); display: flex; flex-direction: column; }
        .conta-menu-topo span { font-size: 0.8rem; color: var(--cinza-aco); }
        .conta-menu a, .conta-menu button { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border-radius: 9px; border: none; background: none; color: var(--branco-gelo); font-family: var(--fonte-corpo); font-size: 0.92rem; font-weight: 500; cursor: pointer; text-align: left; }
        .conta-menu a:hover, .conta-menu button:hover { background: rgba(242, 245, 241, 0.06); color: var(--verde-luz); }
        .cabecalho-toggle { display: none; width: 44px; height: 44px; border-radius: 10px; border: 1px solid var(--borda-sutil); background: transparent; cursor: pointer; flex-direction: column; align-items: center; justify-content: center; gap: 5px; }
        .cabecalho-toggle span { display: block; width: 20px; height: 2px; background: var(--branco-gelo); border-radius: 2px; }

        @media (max-width: 900px) {
          .cabecalho-toggle { display: inline-flex; }
          .cabecalho-nav { display: none; position: absolute; top: var(--altura-cabecalho); left: 0; right: 0; flex-direction: column; align-items: stretch; gap: 0; padding: 12px 20px 22px; background: var(--preto-cartao); border-bottom: 1px solid var(--borda-forte); max-height: calc(100vh - var(--altura-cabecalho)); overflow-y: auto; }
          .cabecalho-nav.aberto { display: flex; }
          .cabecalho-links { flex-direction: column; align-items: stretch; margin: 0; gap: 2px; }
          .cabecalho-links a { padding: 14px 12px; font-size: 1rem; }
          .cabecalho-conta { margin-top: 12px; padding-top: 14px; border-top: 1px solid var(--borda-sutil); }
          .conta-botao { display: none; }
          .conta-menu { display: block; position: static; box-shadow: none; border: none; background: none; padding: 0; }
          .cabecalho-visitante .botao { flex: 1; padding: 13px; }
        }
      `}</style>
    </header>
  );
}
