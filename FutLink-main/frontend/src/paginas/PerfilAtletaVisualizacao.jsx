import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { mensagemDeErro } from '../servicos/api';
import { Carregando, MensagemErro } from '../componentes/Estados';
import Avatar from '../componentes/Avatar';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
import { extrairIdYoutube } from '../servicos/youtube';
import { IconeChat, IconeTime, IconeTaca } from '../componentes/Icones';

export default function PerfilAtletaVisualizacao() {
    const { usuarioId } = useParams();
    const { usuario } = useAutenticacao();
    const [perfil, setPerfil] = useState(null);
    const [videos, setVideos] = useState([]);
    const [clubes, setClubes] = useState([]);
    const [competicoes, setCompeticoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [erroInteresse, setErroInteresse] = useState('');
    const [statusInteresse, setStatusInteresse] = useState(null);
    const [enviandoInteresse, setEnviandoInteresse] = useState(false);
    useEffect(() => {
        const buscar = async () => {
            try {
                const resposta = await api.get(`/perfil-atleta/usuario/${usuarioId}`);
                setPerfil(resposta.data);
            }
            catch (erroRequisicao) {
                setErro(erroRequisicao.response?.status === 404
                    ? 'Esse atleta ainda não preencheu o perfil.'
                    : mensagemDeErro(erroRequisicao, 'Não foi possível carregar esse perfil.'));
            }
            finally {
                setCarregando(false);
            }
        };
        buscar();
    }, [usuarioId]);
    useEffect(() => {
        api.get(`/portfolio/usuario/${usuarioId}`)
            .then((resposta) => setVideos(resposta.data))
            .catch(() => setVideos([]));
    }, [usuarioId]);
    useEffect(() => {
        api.get(`/historico-clubes/usuario/${usuarioId}`)
            .then((resposta) => setClubes(resposta.data))
            .catch(() => setClubes([]));
    }, [usuarioId]);
    useEffect(() => {
        api.get(`/historico-competicoes/usuario/${usuarioId}`)
            .then((resposta) => setCompeticoes(resposta.data))
            .catch(() => setCompeticoes([]));
    }, [usuarioId]);
    useEffect(() => {
        if (usuario.tipo !== 'empresario') return;
        api.get(`/interesses/status/${usuarioId}`)
            .then((resposta) => setStatusInteresse(resposta.data.status))
            .catch(() => setStatusInteresse(null));
    }, [usuarioId, usuario.tipo]);
    const enviarInteresse = async () => {
        setErroInteresse('');
        setEnviandoInteresse(true);
        try {
            await api.post('/interesses', { atletaId: usuarioId });
            setStatusInteresse('pendente');
        }
        catch (erroRequisicao) {
            setErroInteresse(mensagemDeErro(erroRequisicao, 'Não foi possível enviar interesse.'));
        }
        finally {
            setEnviandoInteresse(false);
        }
    };
    if (carregando) {
        return (<div className="pagina">
        <div className="container">
          <Carregando texto="Carregando perfil..."/>
        </div>
      </div>);
    }
    if (erro || !perfil) {
        return (<div className="pagina">
        <div className="container">
          <MensagemErro texto={erro || 'Perfil não encontrado.'}/>
          <Link to="/pesquisa" className="botao botao-secundario">
            Voltar para a pesquisa
          </Link>
        </div>
      </div>);
    }
    const nome = perfil.Usuario?.nome || 'Atleta';
    return (<div className="pagina">
      <div className="container container-estreito">
        <Link to="/pesquisa" className="link-voltar">
          ← Voltar para a pesquisa
        </Link>

        {erroInteresse && <MensagemErro texto={erroInteresse}/>}

        <div className="cartao cartao-perfil-visualizacao">
          <div className="cartao-perfil-cabecalho">
            <Avatar usuarioId={usuarioId} nome={nome} tamanho={92}/>
            <div>
              <h2>{nome}</h2>
              <p className="cartao-perfil-subtitulo">
                {perfil.posicao || 'Posição não informada'}
                {perfil.cidade ? ` · ${perfil.cidade}${perfil.estado ? '/' + perfil.estado : ''}` : ''}
              </p>
            </div>

            {usuario.tipo === 'empresario' && (
              <div className="acao-interesse">
                {statusInteresse === 'pendente' && <span className="etiqueta-status etiqueta-pendente">Interesse enviado</span>}
                {statusInteresse === 'aceito' && (
                  <div className="acoes-match">
                    <span className="etiqueta-status etiqueta-aceito">Match!</span>
                    <Link to={`/mensagens?com=${usuarioId}`} className="botao botao-primario">
                      <IconeChat /> Conversar
                    </Link>
                  </div>
                )}
                {statusInteresse === 'recusado' && <span className="etiqueta-status etiqueta-recusado">Recusado</span>}
                {(statusInteresse === 'nao_enviado' || statusInteresse === null) && (
                  <button className="botao botao-primario" onClick={enviarInteresse} disabled={enviandoInteresse}>
                    {enviandoInteresse ? 'Enviando...' : 'Enviar interesse'}
                  </button>
                )}
              </div>
            )}
          </div>

          <dl className="lista-dados">
            <div>
              <dt>Idade</dt>
              <dd>{perfil.idade ? `${perfil.idade} anos` : '—'}</dd>
            </div>
            <div>
              <dt>Pé dominante</dt>
              <dd>{perfil.pePreferido || '—'}</dd>
            </div>
            <div>
              <dt>Clube atual</dt>
              <dd>{perfil.clubeAtual || '—'}</dd>
            </div>
            <div>
              <dt>Contato</dt>
              <dd>{perfil.Usuario?.email || '—'}</dd>
            </div>
          </dl>

          {perfil.biografia && (<div className="cartao-perfil-bio">
              <h3>Sobre</h3>
              <p>{perfil.biografia}</p>
            </div>)}

          <div className="cartao-perfil-bio">
            <h3>Histórico</h3>
            {clubes.length === 0 && competicoes.length === 0 ? (
              <p className="texto-vazio-portfolio">Esse atleta ainda não adicionou histórico de clubes ou competições.</p>
            ) : (
              <div className="grade-historico">
                {clubes.length > 0 && (
                  <div className="bloco-historico">
                    <h4><IconeTime /> Clubes</h4>
                    <ul className="lista-historico">
                      {clubes.map((item) => (
                        <li key={item.id}>
                          <strong>{item.nomeClube}</strong>
                          {item.categoria ? <span className="etiqueta-resultado"> {item.categoria}</span> : null}
                          <p className="descricao-historico">
                            {[
                              item.anoInicio || item.anoFim ? `${item.anoInicio || '?'} - ${item.anoFim || 'Atual'}` : null,
                              item.cidade ? `${item.cidade}${item.estado ? '/' + item.estado : ''}` : null,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                          {item.descricao && <p className="descricao-historico">{item.descricao}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {competicoes.length > 0 && (
                  <div className="bloco-historico">
                    <h4><IconeTaca /> Competições</h4>
                    <ul className="lista-historico">
                      {competicoes.map((item) => (
                        <li key={item.id}>
                          <strong>{item.nomeCompeticao}</strong>
                          {item.resultado ? <span className="etiqueta-resultado"> {item.resultado}</span> : null}
                          <p className="descricao-historico">
                            {[item.ano, item.clubeOuSelecao].filter(Boolean).join(' · ')}
                          </p>
                          {item.descricao && <p className="descricao-historico">{item.descricao}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="cartao-perfil-bio">
            <h3>Portfólio</h3>
            {videos.length === 0 ? (
              <p className="texto-vazio-portfolio">Esse atleta ainda não adicionou vídeos.</p>
            ) : (
              <div className="grade-portfolio">
                {videos.map((video) => {
                  const idYoutube = extrairIdYoutube(video.urlVideo);
                  return (
                    <a key={video.id} href={video.urlVideo} target="_blank" rel="noreferrer" className="cartao-video-mini">
                      {idYoutube && (
                        <img src={`https://img.youtube.com/vi/${idYoutube}/mqdefault.jpg`} alt={video.titulo || 'Vídeo'} />
                      )}
                      <span>{video.titulo || 'Assistir no YouTube ↗'}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .link-voltar {
          display: inline-block;
          margin-bottom: 20px;
          font-size: 0.9rem;
          color: var(--cinza-aco);
        }
        .link-voltar:hover { color: var(--verde-luz); }
        .cartao-perfil-visualizacao { padding: 28px; }
        .cartao-perfil-cabecalho {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 24px;
        }
        .acao-interesse { margin-left: auto; }
        @media (max-width: 560px) {
          .cartao-perfil-cabecalho { flex-wrap: wrap; }
          .acao-interesse { margin-left: 0; width: 100%; }
          .lista-dados { grid-template-columns: 1fr; }
        }
        .acoes-match { display: flex; align-items: center; gap: 10px; }
        .etiqueta-status {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .etiqueta-pendente { background: rgba(143,209,158,0.12); color: var(--verde-luz); }
        .etiqueta-aceito { background: rgba(63,145,66,0.18); color: var(--verde-luz); }
        .etiqueta-recusado { background: rgba(229,72,77,0.12); color: #ff9a9d; }
        .numero-camisa-grande {
          width: 64px;
          height: 64px;
          font-size: 1.3rem;
        }
        .cartao-perfil-subtitulo {
          font-family: var(--fonte-dados);
          color: var(--verde-luz);
          margin: 4px 0 0 0;
        }
        .lista-dados {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin: 0;
          padding-top: 20px;
          border-top: 1px solid var(--borda-sutil);
        }
        .lista-dados dt {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--cinza-aco);
          margin-bottom: 4px;
        }
        .lista-dados dd {
          margin: 0;
          font-weight: 600;
        }
        .cartao-perfil-bio {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--borda-sutil);
        }
        .cartao-perfil-bio h3 { font-size: 1rem; margin-bottom: 8px; }
        .cartao-perfil-bio p { color: var(--branco-gelo); margin: 0; }
        .texto-vazio-portfolio { color: var(--cinza-aco); font-size: 0.88rem; margin: 0; }
        .grade-historico {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 640px) {
          .grade-historico { grid-template-columns: 1fr; }
        }
        .bloco-historico h4 {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--fonte-corpo); font-size: 0.9rem;
          color: var(--verde-luz); margin: 0 0 10px 0;
        }
        .lista-historico { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .lista-historico li {
          background: var(--preto-cartao-hover);
          border: 1px solid var(--borda-sutil);
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.9rem;
          color: var(--branco-gelo);
        }
        .etiqueta-resultado {
          display: inline-block;
          margin-left: 6px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(63,145,66,0.18);
          color: var(--verde-luz);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .descricao-historico { margin: 6px 0 0 0; color: var(--cinza-aco); font-size: 0.82rem; }
        .grade-portfolio {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 14px;
        }
        .cartao-video-mini {
          display: block;
          border: 1px solid var(--borda-sutil);
          border-radius: 8px;
          overflow: hidden;
          background: var(--preto-cartao-hover);
        }
        .cartao-video-mini:hover { border-color: var(--verde-grama); }
        .cartao-video-mini img { width: 100%; display: block; }
        .cartao-video-mini span {
          display: block;
          padding: 10px 12px;
          font-size: 0.85rem;
          color: var(--branco-gelo);
        }
      `}</style>
    </div>);
}
