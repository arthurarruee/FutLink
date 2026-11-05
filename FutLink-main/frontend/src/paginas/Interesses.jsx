import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mensagemDeErro } from '../servicos/api';
import { Carregando, EstadoVazio, MensagemErro } from '../componentes/Estados';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
import { IconeChat, IconeOlho } from '../componentes/Icones';
import Avatar from '../componentes/Avatar';
import SeloVerificado from '../componentes/SeloVerificado';
import { POSICOES, STATUS_INTERESSE, validarFaixaDeIdade } from '../constantes/posicoes';

const RÓTULO_STATUS = {
  pendente: 'Pendente',
  aceito: 'Aceito',
  recusado: 'Recusado',
};

const FILTROS_VAZIOS = { posicao: '', cidade: '', idadeMin: '', idadeMax: '', status: '' };

export default function Interesses() {
  const { usuario } = useAutenticacao();
  const ehAtleta = usuario.tipo === 'atleta';

  const [interesses, setInteresses] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  // "filtros" = o que está digitado nos campos. "aplicados" = o que foi enviado ao servidor.
  // Campos de texto esperam 0,4 s depois da última tecla (para não consultar a cada letra).
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [aplicados, setAplicados] = useState(FILTROS_VAZIOS);
  const temporizador = useRef(null);
  const ultimoPedido = useRef(0); // evita que uma resposta antiga sobrescreva uma mais nova

  const erroFaixaIdade = validarFaixaDeIdade(filtros.idadeMin, filtros.idadeMax);
  const filtrosAtivos = Object.values(filtros).some((valor) => valor !== '');

  const alterarFiltro = (campo, valor, imediato = false) => {
    const novos = { ...filtros, [campo]: valor };
    setFiltros(novos);
    clearTimeout(temporizador.current);
    if (imediato) setAplicados(novos);
    else temporizador.current = setTimeout(() => setAplicados(novos), 400);
  };

  const limparFiltros = () => {
    clearTimeout(temporizador.current);
    setFiltros(FILTROS_VAZIOS);
    setAplicados(FILTROS_VAZIOS);
  };

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const carregar = useCallback(async () => {
    // Faixa de idade inválida (ex.: 20 a 10): não consulta; o aviso aparece abaixo dos campos.
    if (validarFaixaDeIdade(aplicados.idadeMin, aplicados.idadeMax)) return;
    const pedido = ++ultimoPedido.current;
    setCarregando(true);
    setErro('');
    try {
      // Só enviamos os filtros preenchidos. O filtro de verdade acontece no servidor (backend).
      // Atletas só têm o filtro de status; posição/cidade/idade valem para os atletas listados ao empresário.
      const camposDoTipo = ehAtleta ? ['status'] : Object.keys(FILTROS_VAZIOS);
      const params = {};
      camposDoTipo.forEach((campo) => {
        const valor = String(aplicados[campo]).trim();
        if (valor) params[campo] = valor;
      });
      const rota = ehAtleta ? '/interesses/recebidos' : '/interesses/enviados';
      const resposta = await api.get(rota, { params });
      if (pedido !== ultimoPedido.current) return;
      setInteresses(resposta.data);
    } catch (erroRequisicao) {
      if (pedido !== ultimoPedido.current) return;
      setErro(mensagemDeErro(erroRequisicao, 'Não foi possível carregar seus interesses.'));
    } finally {
      if (pedido === ultimoPedido.current) setCarregando(false);
    }
  }, [aplicados, ehAtleta]);

  useEffect(() => {
    carregar();
  }, [carregar]);

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

  return (
    <div className="pagina">
      <div className="container container-medio">
        <p className="eyebrow-auth">{ehAtleta ? 'Quem quer falar com você' : 'Seus interesses enviados'}</p>
        <h2>Interesses</h2>

        <form className={`cartao filtros-interesses ${ehAtleta ? 'so-status' : ''}`} onSubmit={(e) => e.preventDefault()} aria-label="Filtros de interesses">
          {!ehAtleta && (
            <>
              <div className="campo">
                <label htmlFor="filtro-posicao">Posição</label>
                <select id="filtro-posicao" value={filtros.posicao} onChange={(e) => alterarFiltro('posicao', e.target.value, true)}>
                  <option value="">Todas</option>
                  {POSICOES.map((posicao) => (<option key={posicao} value={posicao}>{posicao}</option>))}
                </select>
              </div>
              <div className="campo">
                <label htmlFor="filtro-cidade">Cidade</label>
                <input id="filtro-cidade" placeholder="ex: Porto Alegre" value={filtros.cidade} onChange={(e) => alterarFiltro('cidade', e.target.value)}/>
              </div>
              <div className="campo">
                <label htmlFor="filtro-idade-min">Idade mín.</label>
                <input id="filtro-idade-min" type="number" min="0" max="100" inputMode="numeric" value={filtros.idadeMin} onChange={(e) => alterarFiltro('idadeMin', e.target.value)}/>
              </div>
              <div className="campo">
                <label htmlFor="filtro-idade-max">Idade máx.</label>
                <input id="filtro-idade-max" type="number" min="0" max="100" inputMode="numeric" value={filtros.idadeMax} onChange={(e) => alterarFiltro('idadeMax', e.target.value)}/>
              </div>
            </>
          )}
          <div className="campo">
            <label htmlFor="filtro-status">Situação</label>
            <select id="filtro-status" value={filtros.status} onChange={(e) => alterarFiltro('status', e.target.value, true)}>
              <option value="">Todas</option>
              {STATUS_INTERESSE.map(({ valor, rotulo }) => (<option key={valor} value={valor}>{rotulo}</option>))}
            </select>
          </div>
          <div className="filtros-acoes">
            <button type="button" className="botao botao-secundario" onClick={limparFiltros} disabled={!filtrosAtivos}>Limpar filtros</button>
          </div>
          {erroFaixaIdade && <p className="filtros-aviso" role="alert">{erroFaixaIdade}</p>}
        </form>

        {mensagem && <div className="mensagem-sucesso" role="status">{mensagem}</div>}
        <MensagemErro texto={erro} aoTentarNovamente={carregar}/>

        {carregando && interesses.length === 0 ? (
          <Carregando texto="Carregando interesses..."/>
        ) : interesses.length === 0 && !erro && filtrosAtivos ? (
          <EstadoVazio titulo="Nenhum interesse encontrado" texto="Nenhum interesse corresponde aos filtros selecionados. Tente remover algum filtro.">
            <div className="estado-acoes"><button type="button" className="botao botao-secundario" onClick={limparFiltros}>Limpar filtros</button></div>
          </EstadoVazio>
        ) : interesses.length === 0 && !erro ? (
          <EstadoVazio titulo={ehAtleta ? 'Nenhum interesse recebido ainda' : 'Nenhum interesse enviado'} texto={ehAtleta ? 'Complete seu perfil e adicione vídeos para ser encontrado por empresários.' : 'Pesquise atletas e envie interesse pelo perfil deles.'}/>
        ) : (<>
          {!erro && <p className="contagem-resultados">{interesses.length} {interesses.length === 1 ? 'interesse encontrado' : 'interesses encontrados'}</p>}
          <div className={`lista-interesses ${carregando ? 'atualizando' : ''}`} aria-busy={carregando}>
            {interesses.map((interesse) => {
              const outraPessoa = ehAtleta ? interesse.Empresario : interesse.Atleta;
              const perfilAtleta = outraPessoa?.PerfilAtleta;
              const posicaoOuCargo = ehAtleta
                ? outraPessoa?.PerfilEmpresario?.empresa || ''
                : [perfilAtleta?.posicao, perfilAtleta?.cidade ? `${perfilAtleta.cidade}${perfilAtleta.estado ? '/' + perfilAtleta.estado : ''}` : '', perfilAtleta?.idade ? `${perfilAtleta.idade} anos` : ''].filter(Boolean).join(' · ');
              const podeConversar = interesse.status === 'aceito';
              return (
                <div key={interesse.id} className="cartao cartao-interesse">
                  <Avatar usuarioId={outraPessoa?.id} nome={outraPessoa?.nome || ''} tamanho={52}/>
                  <div className="cartao-interesse-info">
                    <h3>{outraPessoa?.nome} {outraPessoa?.Verificacao?.status === 'aprovado' && <SeloVerificado/>}</h3>
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
        </>)}
      </div>

      <style>{`
        .filtros-interesses { display: grid; grid-template-columns: 1.1fr 1.4fr 0.8fr 0.8fr 1fr auto; gap: 14px; align-items: end; margin: 24px 0 24px 0; }
        .filtros-interesses.so-status { grid-template-columns: minmax(180px, 280px) auto; }
        .filtros-interesses .campo { margin-bottom: 0; }
        .filtros-interesses .filtros-acoes { display: flex; }
        .filtros-aviso { grid-column: 1 / -1; margin: 0; font-size: 0.85rem; color: #ff9a9d; }
        .contagem-resultados { font-family: var(--fonte-dados); font-size: 0.85rem; margin-bottom: 12px; }
        @media (max-width: 560px) {
          .cartao-interesse { flex-wrap: wrap; }
          .cartao-interesse-info { flex-basis: calc(100% - 76px); min-width: 0; }
          .cartao-interesse-icones, .cartao-interesse-acoes, .etiqueta-status { margin-left: 68px; }
        }
        .lista-interesses.atualizando { opacity: 0.55; transition: opacity 0.15s ease; pointer-events: none; }
        @media (max-width: 860px) {
          .filtros-interesses { grid-template-columns: 1fr 1fr; }
          .filtros-interesses .filtros-acoes { grid-column: 1 / -1; }
          .filtros-interesses .filtros-acoes .botao { width: 100%; }
        }
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
