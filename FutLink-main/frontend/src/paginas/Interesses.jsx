import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mensagemDeErro } from '../servicos/api';
import { Carregando, EstadoVazio, MensagemErro } from '../componentes/Estados';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
import { IconeChat, IconeOlho } from '../componentes/Icones';

const RÓTULO_STATUS = {
  pendente: 'Pendente',
  aceito: 'Aceito',
  recusado: 'Recusado',
};

const POSICOES = ['Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meio-campo', 'Atacante'];

export default function Interesses() {
  const { usuario } = useAutenticacao();
  const ehAtleta = usuario.tipo === 'atleta';

  const [interesses, setInteresses] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [categoria, setCategoria] = useState('');
  const [erro, setErro] = useState('');

  const carregar = async () => {
    setCarregando(true);
    setErro('');
    try {
      const rota = ehAtleta ? '/interesses/recebidos' : '/interesses/enviados';
      const resposta = await api.get(rota);
      setInteresses(resposta.data);
    } catch (erroRequisicao) {
      setErro(mensagemDeErro(erroRequisicao, 'Não foi possível carregar seus interesses.'));
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const responder = async (id, decisao) => {
    setMensagem('');
    try {
      await api.put(`/interesses/${id}/${decisao}`);
      setMensagem(decisao === 'aceitar' ? 'Interesse aceito! Vocês já podem conversar.' : 'Interesse recusado.');
      carregar();
    } catch (erroRequisicao) {
      setMensagem(mensagemDeErro(erroRequisicao, 'Não foi possível responder.'));
    }
  };

  // Empresários enxergam a posição de cada atleta em quem demonstraram interesse.
  // A categoria escolhida não filtra a lista, só traz esses atletas pra frente — os demais continuam aparecendo.
  const interessesOrdenados = useMemo(() => {
    if (ehAtleta || !categoria) return interesses;
    const combina = (item) => (item.Atleta?.PerfilAtleta?.posicao || '') === categoria;
    return [...interesses].sort((a, b) => Number(combina(b)) - Number(combina(a)));
  }, [interesses, categoria, ehAtleta]);

  return (
    <div className="pagina">
      <div className="container container-estreito">
        <p className="eyebrow-auth">{ehAtleta ? 'Quem quer falar com você' : 'Seus interesses enviados'}</p>
        <h2>Interesses</h2>

        {!ehAtleta && (
          <div className="filtro-categoria">
            <label htmlFor="categoria">Categoria</label>
            <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Todas as posições</option>
              {POSICOES.map((posicao) => (
                <option key={posicao} value={posicao}>
                  {posicao}
                </option>
              ))}
            </select>
            {categoria && <span className="dica-categoria">Atletas de "{categoria}" aparecem primeiro na lista.</span>}
          </div>
        )}

        {mensagem && <div className="mensagem-sucesso" role="status">{mensagem}</div>}
        <MensagemErro texto={erro} aoTentarNovamente={carregar}/>

        {carregando ? (
          <Carregando texto="Carregando interesses..."/>
        ) : interessesOrdenados.length === 0 && !erro ? (
          <EstadoVazio titulo={ehAtleta ? 'Nenhum interesse recebido ainda' : 'Nenhum interesse enviado'} texto={ehAtleta ? 'Complete seu perfil e adicione vídeos para ser encontrado por empresários.' : 'Pesquise atletas e envie interesse pelo perfil deles.'}/>
        ) : (
          <div className="lista-interesses">
            {interessesOrdenados.map((interesse) => {
              const outraPessoa = ehAtleta ? interesse.Empresario : interesse.Atleta;
              const posicaoOuCargo = outraPessoa?.PerfilEmpresario?.empresa || outraPessoa?.PerfilAtleta?.posicao || '';
              const podeConversar = interesse.status === 'aceito';
              return (
                <div key={interesse.id} className="cartao cartao-interesse">
                  <div className="numero-camisa">
                    {(outraPessoa?.nome || '?')
                      .split(' ')
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="cartao-interesse-info">
                    <h3>{outraPessoa?.nome}</h3>
                    <p>{posicaoOuCargo}</p>
                  </div>

                  <div className="cartao-interesse-icones">
                    {!ehAtleta && (
                      <Link
                        to={`/atleta/${outraPessoa?.id}`}
                        className="botao-icone"
                        title="Ver perfil do jogador"
                        aria-label="Ver perfil do jogador"
                      >
                        <IconeOlho />
                      </Link>
                    )}
                    {podeConversar && (
                      <Link
                        to={`/mensagens?com=${outraPessoa?.id}`}
                        className="botao-icone"
                        title="Ir para conversa"
                        aria-label="Ir para conversa"
                      >
                        <IconeChat />
                      </Link>
                    )}
                  </div>

                  {ehAtleta && interesse.status === 'pendente' ? (
                    <div className="cartao-interesse-acoes">
                      <button type="button" className="botao botao-primario" onClick={() => responder(interesse.id, 'aceitar')}>
                        Aceitar
                      </button>
                      <button type="button" className="botao botao-secundario" onClick={() => responder(interesse.id, 'recusar')}>
                        Recusar
                      </button>
                    </div>
                  ) : (
                    <span className={`etiqueta-status etiqueta-${interesse.status}`}>
                      {RÓTULO_STATUS[interesse.status]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .filtro-categoria {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0 24px 0;
          flex-wrap: wrap;
        }
        .filtro-categoria label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--cinza-aco);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .filtro-categoria select {
          background-color: var(--preto-cartao);
          border: 1px solid var(--borda-sutil);
          border-radius: 8px;
          padding: 10px 14px;
          color: var(--branco-gelo);
          font-family: var(--fonte-corpo);
          font-size: 0.95rem;
        }
        .dica-categoria { font-size: 0.82rem; color: var(--verde-luz); }
        .lista-interesses { display: flex; flex-direction: column; gap: 12px; }
        .cartao-interesse { display: flex; align-items: center; gap: 16px; }
        .cartao-interesse-info { flex: 1; }
        .cartao-interesse-info h3 { margin: 0 0 4px 0; font-size: 1rem; color: var(--branco-gelo); }
        .cartao-interesse-info p { margin: 0; font-family: var(--fonte-dados); font-size: 0.82rem; color: var(--verde-luz); }
        .cartao-interesse-icones { display: flex; gap: 8px; }
        .botao-icone {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--borda-sutil);
          color: var(--branco-gelo);
          transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
        }
        .botao-icone:hover { border-color: var(--verde-grama); color: var(--verde-luz); background-color: var(--preto-cartao-hover); }
        .cartao-interesse-acoes { display: flex; gap: 8px; }
        .etiqueta-status {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .etiqueta-pendente { background: rgba(143,209,158,0.12); color: var(--verde-luz); }
        .etiqueta-aceito { background: rgba(63,145,66,0.18); color: var(--verde-luz); }
        .etiqueta-recusado { background: rgba(229,72,77,0.12); color: #ff9a9d; }
      `}</style>
    </div>
  );
}
