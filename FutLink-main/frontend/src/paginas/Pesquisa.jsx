import { useEffect, useState } from 'react';
import api from '../servicos/api';
import CartaoAtleta from '../componentes/CartaoAtleta';
export default function Pesquisa() {
    const [filtros, setFiltros] = useState({ nome: '', posicao: '', cidade: '' });
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
            const resposta = await api.get('/perfil-atleta', { params: parametros });
            setAtletas(resposta.data);
        }
        catch (erroRequisicao) {
            setErro('Não foi possível carregar os atletas.');
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
          <button className="botao botao-primario">Pesquisar</button>
        </form>

        {erro && <div className="mensagem-erro">{erro}</div>}

        {carregando ? (<p>Carregando atletas...</p>) : atletas.length === 0 ? (<p>Nenhum atleta encontrado com esses filtros.</p>) : (<div className="lista-atletas">
            {atletas.map((perfil) => (<CartaoAtleta key={perfil.id} perfil={perfil}/>))}
          </div>)}
      </div>

      <style>{`
        .filtros-pesquisa {
          display: grid;
          grid-template-columns: 2fr 1.4fr 1.4fr auto;
          gap: 14px;
          align-items: end;
          margin: 24px 0 32px 0;
        }
        .filtros-pesquisa .campo { margin-bottom: 0; }
        .lista-atletas {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (max-width: 780px) {
          .filtros-pesquisa { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>);
}
