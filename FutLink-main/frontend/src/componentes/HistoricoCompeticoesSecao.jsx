import { useEffect, useState } from 'react';
import api from '../servicos/api';
import { IconeTaca } from './Icones';

const CAMPOS_VAZIOS = { nomeCompeticao: '', ano: '', clubeOuSelecao: '', resultado: '', descricao: '' };
const RESULTADOS = ['Participação', 'Campeão', 'Vice-campeão', 'Semifinalista', 'Outro'];

export default function HistoricoCompeticoesSecao() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [novoItem, setNovoItem] = useState(CAMPOS_VAZIOS);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = async () => {
    setCarregando(true);
    try {
      const resposta = await api.get('/historico-competicoes/me');
      setItens(resposta.data);
    } catch {
      setErro('Não foi possível carregar suas competições.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const aoMudarCampo = (campo, valor) => {
    setNovoItem((atual) => ({ ...atual, [campo]: valor }));
  };

  const aoAdicionar = async (evento) => {
    evento.preventDefault();
    setErro('');
    if (!novoItem.nomeCompeticao.trim()) {
      setErro('Informe o nome da competição.');
      return;
    }
    setEnviando(true);
    try {
      await api.post('/historico-competicoes', novoItem);
      setNovoItem(CAMPOS_VAZIOS);
      carregar();
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.mensagem || 'Não foi possível adicionar essa competição.');
    } finally {
      setEnviando(false);
    }
  };

  const aoExcluir = async (id) => {
    await api.delete(`/historico-competicoes/${id}`);
    setItens((atual) => atual.filter((item) => item.id !== id));
  };

  return (
    <div className="cartao secao-historico">
      <h3 className="titulo-secao titulo-historico">
        <IconeTaca /> Competições
      </h3>
      <p className="subtitulo-perfil">Campeonatos e torneios que você disputou ou conquistou.</p>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <form className="formulario-historico" onSubmit={aoAdicionar}>
        <div className="grade-2">
          <div className="campo">
            <label htmlFor="nomeCompeticao">Nome da competição</label>
            <input
              id="nomeCompeticao"
              placeholder="ex: Copa São Paulo de Futebol Júnior"
              value={novoItem.nomeCompeticao}
              onChange={(e) => aoMudarCampo('nomeCompeticao', e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="anoCompeticao">Ano</label>
            <input
              id="anoCompeticao"
              placeholder="ex: 2023"
              value={novoItem.ano}
              onChange={(e) => aoMudarCampo('ano', e.target.value)}
            />
          </div>
        </div>

        <div className="grade-2">
          <div className="campo">
            <label htmlFor="clubeCompeticao">Clube ou seleção</label>
            <input
              id="clubeCompeticao"
              placeholder="ex: Grêmio Sub-20"
              value={novoItem.clubeOuSelecao}
              onChange={(e) => aoMudarCampo('clubeOuSelecao', e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="resultadoCompeticao">Resultado</label>
            <select
              id="resultadoCompeticao"
              value={novoItem.resultado}
              onChange={(e) => aoMudarCampo('resultado', e.target.value)}
            >
              <option value="">Selecione (opcional)</option>
              {RESULTADOS.map((resultado) => (
                <option key={resultado} value={resultado}>
                  {resultado}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="campo">
          <label htmlFor="descricaoCompeticao">Descrição (opcional)</label>
          <textarea
            id="descricaoCompeticao"
            maxLength={300}
            placeholder="ex: Artilheiro do campeonato com 12 gols"
            value={novoItem.descricao}
            onChange={(e) => aoMudarCampo('descricao', e.target.value)}
          />
        </div>

        <button className="botao botao-secundario" disabled={enviando}>
          {enviando ? 'Adicionando...' : '+ Adicionar competição'}
        </button>
      </form>

      {carregando ? (
        <p>Carregando competições...</p>
      ) : itens.length === 0 ? (
        <p className="texto-vazio-historico">Você ainda não adicionou nenhuma competição.</p>
      ) : (
        <ul className="lista-historico-edicao">
          {itens.map((item) => (
            <li key={item.id}>
              <span className="icone-tipo-historico">
                <IconeTaca />
              </span>
              <div className="item-historico-info">
                <strong>{item.nomeCompeticao}</strong>
                <span className="item-historico-detalhes">
                  {item.ano ? item.ano : ''}
                  {item.clubeOuSelecao ? ` · ${item.clubeOuSelecao}` : ''}
                  {item.resultado ? ` · ${item.resultado}` : ''}
                </span>
                {item.descricao && <p>{item.descricao}</p>}
              </div>
              <button
                type="button"
                className="botao-excluir-historico"
                onClick={() => aoExcluir(item.id)}
                aria-label="Remover competição"
                title="Remover"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .secao-historico { margin-top: 24px; }
        .titulo-historico {
          display: flex; align-items: center; gap: 8px;
          margin-top: 0; padding-top: 0; border-top: none;
        }
        .formulario-historico { margin: 20px 0 24px 0; padding-bottom: 20px; border-bottom: 1px solid var(--borda-sutil); }
        .formulario-historico .campo textarea { min-height: 60px; }
        .texto-vazio-historico { color: var(--cinza-aco); font-size: 0.88rem; margin: 0; }
        .lista-historico-edicao { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .lista-historico-edicao li {
          display: flex; align-items: flex-start; gap: 12px;
          background: var(--preto-cartao-hover); border: 1px solid var(--borda-sutil);
          border-radius: 8px; padding: 12px 14px;
        }
        .icone-tipo-historico { color: var(--verde-luz); flex-shrink: 0; margin-top: 2px; }
        .item-historico-info { flex: 1; }
        .item-historico-info strong { color: var(--branco-gelo); }
        .item-historico-detalhes { font-family: var(--fonte-dados); font-size: 0.8rem; color: var(--verde-luz); margin-left: 6px; }
        .item-historico-info p { margin: 4px 0 0 0; font-size: 0.85rem; color: var(--cinza-aco); }
        .botao-excluir-historico {
          background: transparent; border: none; color: var(--cinza-aco);
          font-size: 1.3rem; line-height: 1; cursor: pointer; padding: 0 4px;
        }
        .botao-excluir-historico:hover { color: #ff9a9d; }
      `}</style>
    </div>
  );
}
