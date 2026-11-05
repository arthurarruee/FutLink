import { useEffect, useRef, useState } from 'react';
import api, { mensagemDeErro } from '../servicos/api';
import { Carregando, EstadoVazio, MensagemErro } from '../componentes/Estados';
import CartaoAtleta from '../componentes/CartaoAtleta';
import { POSICOES, validarFaixaDeIdade } from '../constantes/posicoes';

const FILTROS_VAZIOS = { nome: '', posicao: '', cidade: '', estado: '', idadeMin: '', idadeMax: '' };

export default function Pesquisa() {
    const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
    const [atletas, setAtletas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const ultimoPedido = useRef(0); // evita que uma resposta antiga sobrescreva uma mais nova
    const primeiraVez = useRef(true);

    const erroFaixaIdade = validarFaixaDeIdade(filtros.idadeMin, filtros.idadeMax);
    const filtrosAtivos = Object.values(filtros).some((valor) => valor !== '');

    const buscarAtletas = async (evento) => {
        if (evento)
            evento.preventDefault();
        if (erroFaixaIdade)
            return; // o aviso aparece abaixo dos campos; não consulta com faixa inválida
        const pedido = ++ultimoPedido.current;
        setCarregando(true);
        setErro('');
        try {
            // Só enviamos os filtros preenchidos; quem filtra de verdade é o servidor (backend + MySQL).
            const parametros = {};
            Object.entries(filtros).forEach(([campo, valor]) => {
                if (String(valor).trim()) parametros[campo] = String(valor).trim();
            });
            const resposta = await api.get('/perfil-atleta', { params: parametros });
            if (pedido !== ultimoPedido.current) return;
            setAtletas(resposta.data);
        }
        catch (erroRequisicao) {
            if (pedido !== ultimoPedido.current) return;
            setErro(mensagemDeErro(erroRequisicao, 'Não foi possível carregar os atletas.'));
        }
        finally {
            if (pedido === ultimoPedido.current) setCarregando(false);
        }
    };

    const limparFiltros = () => setFiltros(FILTROS_VAZIOS);

    // A lista se atualiza sozinha quando qualquer filtro muda (com 0,4 s de espera para não consultar a cada tecla).
    // O botão "Pesquisar" continua funcionando e consulta na hora.
    useEffect(() => {
        const espera = primeiraVez.current ? 0 : 400;
        primeiraVez.current = false;
        const temporizador = setTimeout(() => buscarAtletas(), espera);
        return () => clearTimeout(temporizador);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtros]);
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
              {POSICOES.map((posicao) => (<option key={posicao}>{posicao}</option>))}
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
            <button type="button" className="botao botao-secundario" onClick={limparFiltros} disabled={!filtrosAtivos}>Limpar filtros</button>
          </div>
          {erroFaixaIdade && <p className="filtros-aviso" role="alert">{erroFaixaIdade}</p>}
        </form>

        <MensagemErro texto={erro} aoTentarNovamente={buscarAtletas}/>

        {carregando ? (<Carregando texto="Buscando atletas..."/>) : atletas.length === 0 && !erro ? (<EstadoVazio titulo="Nenhum atleta encontrado" texto="Tente remover algum filtro ou pesquisar por outra cidade.">
            {filtrosAtivos && <div className="estado-acoes"><button type="button" className="botao botao-secundario" onClick={limparFiltros}>Limpar filtros</button></div>}
          </EstadoVazio>) : (<>
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
        .filtros-pesquisa .campo:nth-child(-n+3) { grid-column: span 2; }
        .filtros-acoes { display: flex; gap: 10px; grid-column: span 3; align-items: flex-end; }
        .filtros-pesquisa .campo { align-self: end; }
        .filtros-aviso { grid-column: 1 / -1; margin: 0; font-size: 0.85rem; color: #ff9a9d; }
        .contagem-resultados { font-family: var(--fonte-dados); font-size: 0.85rem; margin-bottom: 12px; }
        .lista-atletas {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (max-width: 780px) {
          .filtros-pesquisa { grid-template-columns: 1fr 1fr; }
          .filtros-pesquisa .campo:nth-child(-n+3), .filtros-acoes { grid-column: span 2; }
        }
      `}</style>
    </div>);
}
