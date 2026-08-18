import { useEffect, useState } from 'react';
import api from '../servicos/api';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';

const RÓTULO_STATUS = {
  pendente: 'Pendente',
  aceito: 'Aceito',
  recusado: 'Recusado',
};

export default function Interesses() {
  const { usuario } = useAutenticacao();
  const ehAtleta = usuario.tipo === 'atleta';

  const [interesses, setInteresses] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  const carregar = async () => {
    setCarregando(true);
    try {
      const rota = ehAtleta ? '/interesses/recebidos' : '/interesses/enviados';
      const resposta = await api.get(rota);
      setInteresses(resposta.data);
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
      setMensagem(erroRequisicao.response?.data?.mensagem || 'Não foi possível responder.');
    }
  };

  return (
    <div className="pagina">
      <div className="container container-estreito">
        <p className="eyebrow-auth">{ehAtleta ? 'Quem quer falar com você' : 'Seus interesses enviados'}</p>
        <h2>Interesses</h2>

        {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}

        {carregando ? (
          <p>Carregando...</p>
        ) : interesses.length === 0 ? (
          <p>{ehAtleta ? 'Nenhum interesse recebido ainda.' : 'Você ainda não enviou interesse a nenhum atleta.'}</p>
        ) : (
          <div className="lista-interesses">
            {interesses.map((interesse) => {
              const outraPessoa = ehAtleta ? interesse.Empresario : interesse.Atleta;
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
                    <p>{outraPessoa?.PerfilEmpresario?.empresa || outraPessoa?.PerfilAtleta?.posicao || ''}</p>
                  </div>

                  {ehAtleta && interesse.status === 'pendente' ? (
                    <div className="cartao-interesse-acoes">
                      <button className="botao botao-primario" onClick={() => responder(interesse.id, 'aceitar')}>
                        Aceitar
                      </button>
                      <button className="botao botao-secundario" onClick={() => responder(interesse.id, 'recusar')}>
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
        .lista-interesses { display: flex; flex-direction: column; gap: 12px; }
        .cartao-interesse { display: flex; align-items: center; gap: 16px; }
        .cartao-interesse-info { flex: 1; }
        .cartao-interesse-info h3 { margin: 0 0 4px 0; font-size: 1rem; color: var(--branco-gelo); }
        .cartao-interesse-info p { margin: 0; font-family: var(--fonte-dados); font-size: 0.82rem; color: var(--verde-luz); }
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
