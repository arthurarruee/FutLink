import { useEffect, useState } from 'react';
import api, { mensagemDeErro } from '../servicos/api';
import { Carregando, EstadoVazio, MensagemErro } from '../componentes/Estados';
import CartaoAtleta from '../componentes/CartaoAtleta';
export default function Pesquisa() {
    const [filtros, setFiltros] = useState({ nome: '', posicao: '', cidade: '', estado: '', idadeMin: '', idadeMax: '' });
    const [atletas, setAtletas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const buscarAtletas = async (evento) => {
        if (evento)
            evento.preventDefault();
        setCarregando(true);
        setErro('');
        try {
            const parametros = {};
            if (filtros.nome)
                parametros.nome = filtros.nome;
            if (filtros.posicao)
                parametros.posicao = filtros.posicao;
            if (filtros.cidade)
                parametros.cidade = filtros.cidade;
            if (filtros.estado)
                parametros.estado = filtros.estado;
            if (filtros.idadeMin)
                parametros.idadeMin = filtros.idadeMin;
            if (filtros.idadeMax)
                parametros.idadeMax = filtros.idadeMax;
            const resposta = await api.get('/perfil-atleta', { params: parametros });
            setAtletas(resposta.data);
        }
        catch (erroRequisicao) {
            setErro(mensagemDeErro(erroRequisicao, 'Não foi possível carregar os atletas.'));
        }
        finally {
            setCarregando(false);
        }
    };
    const limparFiltros = async () => {
        const vazios = { nome: '', posicao: '', cidade: '', estado: '', idadeMin: '', idadeMax: '' };
        setFiltros(vazios);
        setCarregando(true);
        setErro('');
        try {
            const resposta = await api.get('/perfil-atleta');
            setAtletas(resposta.data);
        }
        catch (erroRequisicao) {
            setErro(mensagemDeErro(erroRequisicao, 'Não foi possível carregar os atletas.'));
        }
        finally {
            setCarregando(false);
        }
    };
    useEffect(() => {
        buscarAtletas();
    }, []);
    return (<div className="pagina">
      <div className="container">
        <p className="eyebrow-auth">Pesquisa</p>
        <h2>Encontre atletas</h2>

        <form className="cartao filtros-pesquisa" onSubmit={buscarAtletas}>
          <div className="campo">
            <label htmlFor="nome">Nome</label>
            <input id="nome" placeholder="Buscar por nome" value={filtros.nome} onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })}/>
          </div>
          <div className="campo">
            <label htmlFor="posicao">Posição</label>
            <select id="posicao" value={filtros.posicao} onChange={(e) => setFiltros({ ...filtros, posicao: e.target.value })}>
              <option value="">Todas</option>
              <option>Goleiro</option>
              <option>Zagueiro</option>
              <option>Lateral</option>
              <option>Volante</option>
              <option>Meio-campo</option>
              <option>Atacante</option>
            </select>
          </div>
          <div className="campo">
            <label htmlFor="cidade">Cidade</label>
            <input id="cidade" placeholder="ex: Porto Alegre" value={filtros.cidade} onChange={(e) => setFiltros({ ...filtros, cidade: e.target.value })}/>
          </div>
          <div className="campo">
            <label htmlFor="estado">Estado</label>
            <input id="estado" maxLength={2} placeholder="ex: RS" value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value.toUpperCase() })}/>
          </div>
          <div className="campo">
            <label htmlFor="idadeMin">Idade mín.</label>
            <input id="idadeMin" type="number" min="10" max="60" value={filtros.idadeMin} onChange={(e) => setFiltros({ ...filtros, idadeMin: e.target.value })}/>
          </div>
          <div className="campo">
            <label htmlFor="idadeMax">Idade máx.</label>
            <input id="idadeMax" type="number" min="10" max="60" value={filtros.idadeMax} onChange={(e) => setFiltros({ ...filtros, idadeMax: e.target.value })}/>
          </div>
          <div className="filtros-acoes">
            <button className="botao botao-primario">Pesquisar</button>
            <button type="button" className="botao botao-secundario" onClick={limparFiltros}>Limpar</button>
          </div>
        </form>

        <MensagemErro texto={erro} aoTentarNovamente={buscarAtletas}/>

        {carregando ? (<Carregando texto="Buscando atletas..."/>) : atletas.length === 0 && !erro ? (<EstadoVazio titulo="Nenhum atleta encontrado" texto="Tente remover algum filtro ou pesquisar por outra cidade."/>) : (<>
            {!erro && <p className="contagem-resultados">{atletas.length} {atletas.length === 1 ? 'atleta encontrado' : 'atletas encontrados'}</p>}
            <div className="lista-atletas">
              {atletas.map((perfil) => (<CartaoAtleta key={perfil.id} perfil={perfil}/>))}
            </div>
          </>)}
      </div>

      <style>{`
        .filtros-pesquisa {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
          align-items: end;
          margin: 24px 0 32px 0;
        }
        .filtros-pesquisa .campo { margin-bottom: 0; }
        .filtros-pesquisa .campo:first-child { grid-column: span 2; }
        .filtros-acoes { display: flex; gap: 10px; grid-column: span 2; }
        .contagem-resultados { font-family: var(--fonte-dados); font-size: 0.85rem; margin-bottom: 12px; }
        .lista-atletas {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (max-width: 780px) {
          .filtros-pesquisa { grid-template-columns: 1fr 1fr; }
          .filtros-pesquisa .campo:first-child, .filtros-acoes { grid-column: span 2; }
        }
      `}</style>
    </div>);
}
