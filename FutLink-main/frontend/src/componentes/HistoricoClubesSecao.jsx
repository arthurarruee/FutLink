import { useEffect, useState } from 'react';
import api, { mensagemDeErro } from '../servicos/api';
import { IconeTime } from './Icones';

const CAMPOS_VAZIOS = { nomeClube: '', categoria: '', cidade: '', estado: '', anoInicio: '', anoFim: '', descricao: '' };
const CATEGORIAS = ['Sub-15', 'Sub-17', 'Sub-20', 'Profissional', 'Amador', 'Várzea'];

export default function HistoricoClubesSecao() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [novoItem, setNovoItem] = useState(CAMPOS_VAZIOS);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = async () => {
    setCarregando(true);
    try {
      const resposta = await api.get('/historico-clubes/me');
      setItens(resposta.data);
    } catch {
      setErro('Não foi possível carregar seus clubes.');
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
    if (!novoItem.nomeClube.trim()) {
      setErro('Informe o nome do clube.');
      return;
    }
    setEnviando(true);
    try {
      await api.post('/historico-clubes', novoItem);
      setNovoItem(CAMPOS_VAZIOS);
      carregar();
    } catch (erroRequisicao) {
      setErro(mensagemDeErro(erroRequisicao, 'Não foi possível adicionar esse clube.'));
    } finally {
      setEnviando(false);
    }
  };

  const aoExcluir = async (id) => {
    if (!window.confirm('Remover este item do seu histórico?')) return;
    try {
      await api.delete(`/historico-clubes/${id}`);
      setItens((atual) => atual.filter((item) => item.id !== id));
    } catch (erroRequisicao) {
      setErro(mensagemDeErro(erroRequisicao, 'Não foi possível remover este item.'));
    }
  };

  return (
    <div className="cartao secao-historico">
      <h3 className="titulo-secao titulo-historico">
        <IconeTime /> Clubes
      </h3>
      <p className="subtitulo-perfil">Times pelos quais você já jogou ou joga atualmente.</p>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <form className="formulario-historico" onSubmit={aoAdicionar}>
        <div className="grade-2">
          <div className="campo">
            <label htmlFor="nomeClube">Nome do clube</label>
            <input
              id="nomeClube"
              placeholder="ex: Grêmio Foot-Ball Porto Alegrense"
              value={novoItem.nomeClube}
              onChange={(e) => aoMudarCampo('nomeClube', e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="categoriaClube">Categoria</label>
            <select id="categoriaClube" value={novoItem.categoria} onChange={(e) => aoMudarCampo('categoria', e.target.value)}>
              <option value="">Selecione (opcional)</option>
              {CATEGORIAS.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grade-2">
          <div className="campo">
            <label htmlFor="cidadeClube">Cidade</label>
            <input
              id="cidadeClube"
              placeholder="ex: Porto Alegre"
              value={novoItem.cidade}
              onChange={(e) => aoMudarCampo('cidade', e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="estadoClube">Estado</label>
            <input
              id="estadoClube"
              placeholder="ex: RS"
              maxLength={2}
              value={novoItem.estado}
              onChange={(e) => aoMudarCampo('estado', e.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div className="grade-2">
          <div className="campo">
            <label htmlFor="anoInicioClube">Ano de início</label>
            <input
              id="anoInicioClube"
              placeholder="ex: 2022"
              value={novoItem.anoInicio}
              onChange={(e) => aoMudarCampo('anoInicio', e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="anoFimClube">Ano de saída</label>
            <input
              id="anoFimClube"
              placeholder="ex: 2023 ou Atual"
              value={novoItem.anoFim}
              onChange={(e) => aoMudarCampo('anoFim', e.target.value)}
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="descricaoClube">Descrição (opcional)</label>
          <textarea
            id="descricaoClube"
            maxLength={300}
            placeholder="ex: Titular na lateral direita, 30 jogos na temporada"
            value={novoItem.descricao}
            onChange={(e) => aoMudarCampo('descricao', e.target.value)}
          />
        </div>

        <button className="botao botao-secundario" disabled={enviando}>
          {enviando ? 'Adicionando...' : '+ Adicionar clube'}
        </button>
      </form>

      {carregando ? (
        <p>Carregando clubes...</p>
      ) : itens.length === 0 ? (
        <p className="texto-vazio-historico">Você ainda não adicionou nenhum clube.</p>
      ) : (
        <ul className="lista-historico-edicao">
          {itens.map((item) => (
            <li key={item.id}>
              <span className="icone-tipo-historico">
                <IconeTime />
              </span>
              <div className="item-historico-info">
                <strong>{item.nomeClube}</strong>
                <span className="item-historico-detalhes">
                  {item.categoria ? item.categoria : ''}
                  {item.anoInicio || item.anoFim ? ` · ${item.anoInicio || '?'} - ${item.anoFim || 'Atual'}` : ''}
                  {item.cidade ? ` · ${item.cidade}${item.estado ? '/' + item.estado : ''}` : ''}
                </span>
                {item.descricao && <p>{item.descricao}</p>}
              </div>
              <button
                type="button"
                className="botao-excluir-historico"
                onClick={() => aoExcluir(item.id)}
                aria-label="Remover clube"
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
