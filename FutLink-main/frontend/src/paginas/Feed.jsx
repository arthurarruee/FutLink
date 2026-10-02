import { useEffect, useState } from 'react';
import api from '../servicos/api';
import { extrairIdYoutube } from '../servicos/youtube';

export default function Feed() {
  const [videos, setVideos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [urlVideo, setUrlVideo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarVideos = async () => {
    setCarregando(true);
    try {
      const resposta = await api.get('/portfolio/me');
      setVideos(resposta.data);
    } catch {
      setErro('Não foi possível carregar seu portfólio.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarVideos();
  }, []);

  const aoAdicionar = async (evento) => {
    evento.preventDefault();
    setErro('');

    if (!extrairIdYoutube(urlVideo)) {
      setErro('Cole um link válido de vídeo do YouTube.');
      return;
    }

    setEnviando(true);
    try {
      await api.post('/portfolio', { urlVideo, titulo });
      setUrlVideo('');
      setTitulo('');
      carregarVideos();
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.mensagem || 'Não foi possível adicionar o vídeo.');
    } finally {
      setEnviando(false);
    }
  };

  const aoExcluir = async (id) => {
    await api.delete(`/portfolio/${id}`);
    setVideos((atual) => atual.filter((video) => video.id !== id));
  };

  return (
    <div className="pagina">
      <div className="container container-estreito">
        <p className="eyebrow-auth">Seu feed</p>
        <h2>Portfólio de vídeos</h2>
        <p className="subtitulo-perfil">
          Cole links de vídeos do YouTube — jogadas, gols, treinos — pra empresários verem seu futebol de verdade.
        </p>

        <form className="cartao" onSubmit={aoAdicionar}>
          {erro && <div className="mensagem-erro">{erro}</div>}
          <div className="campo">
            <label htmlFor="urlVideo">Link do vídeo (YouTube)</label>
            <input
              id="urlVideo"
              placeholder="https://www.youtube.com/watch?v=..."
              value={urlVideo}
              onChange={(e) => setUrlVideo(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="titulo">Título (opcional)</label>
            <input
              id="titulo"
              placeholder="ex: Gols da temporada 2025"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <button className="botao botao-primario" disabled={enviando}>
            {enviando ? 'Adicionando...' : 'Adicionar ao portfólio'}
          </button>
        </form>

        {carregando ? (
          <p>Carregando...</p>
        ) : videos.length === 0 ? (
          <p>Você ainda não adicionou nenhum vídeo.</p>
        ) : (
          <div className="grade-feed">
            {videos.map((video) => {
              const idYoutube = extrairIdYoutube(video.urlVideo);
              return (
                <div key={video.id} className="cartao cartao-video">
                  {idYoutube && (
                    <img
                      src={`https://img.youtube.com/vi/${idYoutube}/mqdefault.jpg`}
                      alt={video.titulo || 'Vídeo do portfólio'}
                    />
                  )}
                  <div className="cartao-video-corpo">
                    <p className="cartao-video-titulo">{video.titulo || 'Sem título'}</p>
                    <a href={video.urlVideo} target="_blank" rel="noreferrer">
                      Assistir no YouTube ↗
                    </a>
                    <button className="botao botao-secundario" onClick={() => aoExcluir(video.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .grade-feed {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
          margin-top: 28px;
        }
        .cartao-video { padding: 0; overflow: hidden; }
        .cartao-video img { width: 100%; display: block; }
        .cartao-video-corpo { padding: 16px; }
        .cartao-video-titulo { font-weight: 600; color: var(--branco-gelo); margin-bottom: 8px; }
        .cartao-video-corpo a { display: block; font-size: 0.85rem; margin-bottom: 12px; }
        .cartao-video-corpo .botao { width: 100%; }
      `}</style>
    </div>
  );
}
