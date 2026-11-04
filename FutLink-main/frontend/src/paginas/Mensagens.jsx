import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { mensagemDeErro } from '../servicos/api';
import { Carregando, MensagemErro } from '../componentes/Estados';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
import { IconeOlho } from '../componentes/Icones';

export default function Mensagens() {
  const { usuario } = useAutenticacao();
  const ehAtleta = usuario.tipo === 'atleta';
  const [parametrosUrl] = useSearchParams();
  const usuarioIdAlvo = parametrosUrl.get('com');

  const [matches, setMatches] = useState([]);
  const [matchSelecionado, setMatchSelecionado] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [carregandoMatches, setCarregandoMatches] = useState(true);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const fimDaConversaRef = useRef(null);

  useEffect(() => {
    const carregarMatches = async () => {
      try {
        const resposta = await api.get('/matches');
        setMatches(resposta.data);
      } catch (erroRequisicao) {
        setErro(mensagemDeErro(erroRequisicao, 'Não foi possível carregar suas conversas.'));
      } finally {
        setCarregandoMatches(false);
      }
    };
    carregarMatches();
  }, []);

  const abrirConversa = async (match) => {
    setMatchSelecionado(match);
    setErro('');
    setMensagens([]);
    const outraPessoa = ehAtleta ? match.Empresario : match.Atleta;
    try {
      const resposta = await api.get(`/mensagens/${outraPessoa.id}`);
      setMensagens(resposta.data);
    } catch (erroRequisicao) {
      setErro(mensagemDeErro(erroRequisicao, 'Não foi possível carregar a conversa.'));
    }
  };

  // Quando chega em /mensagens?com=<usuarioId> (vindo do perfil ou da aba interesses),
  // abre direto a conversa com essa pessoa, sem precisar clicar na lista ao lado.
  useEffect(() => {
    if (!usuarioIdAlvo || carregandoMatches || matches.length === 0) return;
    const matchAlvo = matches.find((match) => {
      const outraPessoa = ehAtleta ? match.Empresario : match.Atleta;
      return String(outraPessoa?.id) === String(usuarioIdAlvo);
    });
    if (matchAlvo) {
      abrirConversa(matchAlvo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioIdAlvo, carregandoMatches, matches]);

  useEffect(() => {
    fimDaConversaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviar = async (evento) => {
    evento.preventDefault();
    if (!texto.trim() || !matchSelecionado) return;

    const outraPessoa = ehAtleta ? matchSelecionado.Empresario : matchSelecionado.Atleta;
    setErro('');
    setEnviando(true);
    try {
      const resposta = await api.post('/mensagens', { destinatarioId: outraPessoa.id, conteudo: texto });
      setMensagens((atual) => [...atual, resposta.data]);
      setTexto('');
    } catch (erroRequisicao) {
      // O texto continua no campo para a pessoa não perder o que escreveu.
      setErro(mensagemDeErro(erroRequisicao, 'Não foi possível enviar a mensagem.'));
    } finally {
      setEnviando(false);
    }
  };

  const outraPessoaSelecionada = matchSelecionado ? (ehAtleta ? matchSelecionado.Empresario : matchSelecionado.Atleta) : null;

  return (
    <div className="pagina">
      <div className="container">
        <p className="eyebrow-auth">Conversas</p>
        <h2>Mensagens</h2>
        <MensagemErro texto={erro}/>

        <div className="area-mensagens">
          <aside className="lista-conversas cartao">
            {carregandoMatches ? (
              <Carregando/>
            ) : matches.length === 0 ? (
              <p className="texto-vazio">
                Você ainda não tem matches. {ehAtleta ? 'Aceite um interesse' : 'Envie um interesse e espere aceitarem'}{' '}
                pra começar a conversar.
              </p>
            ) : (
              matches.map((match) => {
                const outraPessoa = ehAtleta ? match.Empresario : match.Atleta;
                const ativo = matchSelecionado?.id === match.id;
                return (
                  <button
                    key={match.id}
                    className={`item-conversa ${ativo ? 'ativo' : ''}`}
                    onClick={() => abrirConversa(match)}
                  >
                    <span className="numero-camisa">
                      {(outraPessoa?.nome || '?')
                        .split(' ')
                        .slice(0, 2)
                        .map((p) => p[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                    {outraPessoa?.nome}
                  </button>
                );
              })
            )}
          </aside>

          <section className="cartao janela-chat">
            {!matchSelecionado ? (
              <p className="texto-vazio">Selecione uma conversa ao lado.</p>
            ) : (
              <>
                <div className="cabecalho-chat">
                  <span className="cabecalho-chat-nome">{outraPessoaSelecionada?.nome}</span>
                  {!ehAtleta && (
                    <Link
                      to={`/atleta/${outraPessoaSelecionada?.id}`}
                      className="botao-icone"
                      title="Ver perfil do jogador"
                      aria-label="Ver perfil do jogador"
                    >
                      <IconeOlho />
                    </Link>
                  )}
                </div>
                <div className="mensagens-lista">
                  {mensagens.map((msg) => (
                    <div
                      key={msg.id}
                      className={`bolha-mensagem ${msg.remetenteId === usuario.id ? 'minha' : ''}`}
                    >
                      {msg.conteudo}
                    </div>
                  ))}
                  <div ref={fimDaConversaRef} />
                </div>
                <form className="formulario-chat" onSubmit={enviar}>
                  <input
                    placeholder="Escreva uma mensagem..."
                    maxLength={1000}
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                  />
                  <button className="botao botao-primario" disabled={enviando || !texto.trim()}>{enviando ? 'Enviando...' : 'Enviar'}</button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .area-mensagens { grid-template-columns: 1fr !important; height: auto !important; }
          .lista-conversas { max-height: 200px; }
          .janela-chat { min-height: 420px; }
        }
        .area-mensagens {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 18px;
          margin-top: 24px;
          height: 560px;
        }
        .lista-conversas { padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
        .item-conversa {
          display: flex; align-items: center; gap: 10px;
          background: transparent; border: none; text-align: left;
          padding: 10px; border-radius: 8px; color: var(--branco-gelo);
          font-family: var(--fonte-corpo); font-weight: 500; cursor: pointer;
        }
        .item-conversa .numero-camisa { width: 32px; height: 32px; font-size: 0.75rem; }
        .item-conversa:hover, .item-conversa.ativo { background: var(--preto-cartao-hover); }
        .janela-chat { display: flex; flex-direction: column; padding: 0; overflow: hidden; }
        .cabecalho-chat {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; border-bottom: 1px solid var(--borda-sutil);
        }
        .cabecalho-chat-nome { font-weight: 700; color: var(--branco-gelo); }
        .botao-icone {
          display: inline-flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--borda-sutil);
          color: var(--branco-gelo); transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
        }
        .botao-icone:hover { border-color: var(--verde-grama); color: var(--verde-luz); background-color: var(--preto-cartao-hover); }
        .mensagens-lista { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
        .bolha-mensagem {
          align-self: flex-start; max-width: 65%;
          background: var(--preto-cartao-hover); padding: 10px 14px; border-radius: 12px 12px 12px 2px;
          font-size: 0.92rem;
        }
        .bolha-mensagem.minha {
          align-self: flex-end; background: var(--verde-copa); color: var(--branco-gelo);
          border-radius: 12px 12px 2px 12px;
        }
        .formulario-chat { display: flex; gap: 10px; padding: 16px; border-top: 1px solid var(--borda-sutil); }
        .formulario-chat input {
          flex: 1; background: var(--preto-estadio); border: 1px solid var(--borda-sutil);
          border-radius: 8px; padding: 10px 14px; color: var(--branco-gelo); outline: none;
        }
        .texto-vazio { padding: 20px; color: var(--cinza-aco); font-size: 0.9rem; }
      `}</style>
    </div>
  );
}
