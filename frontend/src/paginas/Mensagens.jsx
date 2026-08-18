import { useEffect, useRef, useState } from 'react';
import api from '../servicos/api';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';

export default function Mensagens() {
  const { usuario } = useAutenticacao();
  const ehAtleta = usuario.tipo === 'atleta';

  const [matches, setMatches] = useState([]);
  const [matchSelecionado, setMatchSelecionado] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [carregandoMatches, setCarregandoMatches] = useState(true);
  const fimDaConversaRef = useRef(null);

  useEffect(() => {
    const carregarMatches = async () => {
      try {
        const resposta = await api.get('/matches');
        setMatches(resposta.data);
      } finally {
        setCarregandoMatches(false);
      }
    };
    carregarMatches();
  }, []);

  const abrirConversa = async (match) => {
    setMatchSelecionado(match);
    const outraPessoa = ehAtleta ? match.Empresario : match.Atleta;
    const resposta = await api.get(`/mensagens/${outraPessoa.id}`);
    setMensagens(resposta.data);
  };

  useEffect(() => {
    fimDaConversaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviar = async (evento) => {
    evento.preventDefault();
    if (!texto.trim() || !matchSelecionado) return;

    const outraPessoa = ehAtleta ? matchSelecionado.Empresario : matchSelecionado.Atleta;
    const resposta = await api.post('/mensagens', { destinatarioId: outraPessoa.id, conteudo: texto });
    setMensagens((atual) => [...atual, resposta.data]);
    setTexto('');
  };

  return (
    <div className="pagina">
      <div className="container">
        <p className="eyebrow-auth">Conversas</p>
        <h2>Mensagens</h2>

        <div className="area-mensagens">
          <aside className="lista-conversas cartao">
            {carregandoMatches ? (
              <p>Carregando...</p>
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
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                  />
                  <button className="botao botao-primario">Enviar</button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>

      <style>{`
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
