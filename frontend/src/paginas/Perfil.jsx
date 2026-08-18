import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../servicos/api';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';

const CAMPOS_VAZIOS_ATLETA = {
  idade: '',
  posicao: '',
  pePreferido: '',
  clubeAtual: '',
  cidade: '',
  estado: '',
  biografia: '',
};

const CAMPOS_VAZIOS_EMPRESARIO = {
  empresa: '',
  cargo: '',
  cidade: '',
  estado: '',
  biografia: '',
};

export default function Perfil() {
  const { usuario, atualizarUsuario, sair } = useAutenticacao();
  const navegar = useNavigate();
  const ehAtleta = usuario.tipo === 'atleta';
  const rotaBase = ehAtleta ? '/perfil-atleta' : '/perfil-empresario';
  const proximaRota = ehAtleta ? '/feed' : '/pesquisa';
  const proximoRotulo = ehAtleta ? 'Ir para o feed' : 'Ir para a pesquisa';

  const [conta, setConta] = useState({ nome: usuario.nome, email: usuario.email });
  const [dados, setDados] = useState(ehAtleta ? CAMPOS_VAZIOS_ATLETA : CAMPOS_VAZIOS_EMPRESARIO);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarPerfil = async () => {
      try {
        const resposta = await api.get(`${rotaBase}/me`);
        setDados((atual) => ({ ...atual, ...resposta.data }));
      } catch (erroRequisicao) {
        if (erroRequisicao.response?.status !== 404) {
          setErro('Não foi possível carregar seu perfil.');
        }
      } finally {
        setCarregando(false);
      }
    };
    buscarPerfil();
  }, [rotaBase]);

  const aoMudarCampo = (campo, valor) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  };

  const aoMudarConta = (campo, valor) => {
    setConta((atual) => ({ ...atual, [campo]: valor }));
  };

  const aoSalvar = async (evento) => {
    evento.preventDefault();
    setSalvando(true);
    setMensagem('');
    setErro('');
    try {
      await api.put('/usuarios/me', conta);
      atualizarUsuario(conta);

      await api.put(rotaBase, dados);

      setMensagem('Dados salvos com sucesso!');
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.mensagem || 'Não foi possível salvar seus dados.');
    } finally {
      setSalvando(false);
    }
  };

  const aoExcluirConta = async () => {
    const confirmou = window.confirm(
      'Tem certeza que quer excluir sua conta? Essa ação não pode ser desfeita — seu perfil, portfólio, interesses e mensagens serão apagados.'
    );
    if (!confirmou) return;

    setExcluindo(true);
    try {
      await api.delete('/usuarios/me');
      sair();
      navegar('/');
    } catch (erroRequisicao) {
      setErro(erroRequisicao.response?.data?.mensagem || 'Não foi possível excluir sua conta.');
      setExcluindo(false);
    }
  };

  if (carregando) {
    return (
      <div className="pagina">
        <div className="container">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="pagina">
      <div className="container container-estreito">
        <p className="eyebrow-auth">{ehAtleta ? 'Perfil de atleta' : 'Perfil de empresário'}</p>
        <h2>Olá, {usuario.nome.split(' ')[0]}</h2>
        <p className="subtitulo-perfil">
          {ehAtleta
            ? 'Esses dados aparecem pra empresários que te encontrarem na pesquisa.'
            : 'Complete seus dados profissionais para entrar em contato com atletas.'}
        </p>

        <form className="cartao" onSubmit={aoSalvar}>
          {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}
          {erro && <div className="mensagem-erro">{erro}</div>}

          <h3 className="titulo-secao">Dados da conta</h3>
          <div className="grade-2">
            <div className="campo">
              <label htmlFor="nome">Nome</label>
              <input id="nome" value={conta.nome} onChange={(e) => aoMudarConta('nome', e.target.value)} required />
            </div>
            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={conta.email}
                onChange={(e) => aoMudarConta('email', e.target.value)}
                required
              />
            </div>
          </div>

          <h3 className="titulo-secao">{ehAtleta ? 'Dados de atleta' : 'Dados profissionais'}</h3>

          {ehAtleta ? (
            <>
              <div className="grade-2">
                <div className="campo">
                  <label htmlFor="idade">Idade</label>
                  <input
                    id="idade"
                    type="number"
                    min="10"
                    max="60"
                    value={dados.idade || ''}
                    onChange={(e) => aoMudarCampo('idade', e.target.value)}
                  />
                </div>
                <div className="campo">
                  <label htmlFor="posicao">Posição</label>
                  <select id="posicao" value={dados.posicao || ''} onChange={(e) => aoMudarCampo('posicao', e.target.value)}>
                    <option value="">Selecione</option>
                    <option>Goleiro</option>
                    <option>Zagueiro</option>
                    <option>Lateral</option>
                    <option>Volante</option>
                    <option>Meio-campo</option>
                    <option>Atacante</option>
                  </select>
                </div>
              </div>

              <div className="grade-2">
                <div className="campo">
                  <label htmlFor="pePreferido">Pé preferido</label>
                  <select
                    id="pePreferido"
                    value={dados.pePreferido || ''}
                    onChange={(e) => aoMudarCampo('pePreferido', e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option>Direito</option>
                    <option>Esquerdo</option>
                    <option>Ambidestro</option>
                  </select>
                </div>
                <div className="campo">
                  <label htmlFor="clubeAtual">Clube atual</label>
                  <input
                    id="clubeAtual"
                    value={dados.clubeAtual || ''}
                    onChange={(e) => aoMudarCampo('clubeAtual', e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="grade-2">
              <div className="campo">
                <label htmlFor="empresa">Empresa / Clube</label>
                <input id="empresa" value={dados.empresa || ''} onChange={(e) => aoMudarCampo('empresa', e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="cargo">Cargo</label>
                <input id="cargo" value={dados.cargo || ''} onChange={(e) => aoMudarCampo('cargo', e.target.value)} />
              </div>
            </div>
          )}

          <div className="grade-2">
            <div className="campo">
              <label htmlFor="cidade">Cidade</label>
              <input id="cidade" value={dados.cidade || ''} onChange={(e) => aoMudarCampo('cidade', e.target.value)} />
            </div>
            <div className="campo">
              <label htmlFor="estado">Estado</label>
              <input
                id="estado"
                maxLength={2}
                placeholder="ex: RS"
                value={dados.estado || ''}
                onChange={(e) => aoMudarCampo('estado', e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="campo">
            <label htmlFor="biografia">Biografia</label>
            <textarea
              id="biografia"
              maxLength={500}
              value={dados.biografia || ''}
              onChange={(e) => aoMudarCampo('biografia', e.target.value)}
            />
          </div>

          <div className="acoes-perfil">
            <button className="botao botao-primario" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
            {mensagem && (
              <button type="button" className="botao botao-secundario" onClick={() => navegar(proximaRota)}>
                {proximoRotulo} →
              </button>
            )}
          </div>
        </form>

        <div className="cartao cartao-perigo">
          <h3 className="titulo-secao titulo-perigo">Excluir conta</h3>
          <p className="texto-perigo">
            Isso apaga sua conta, seu perfil, seu portfólio, seus interesses e suas mensagens permanentemente. Não tem
            como desfazer.
          </p>
          <button className="botao botao-perigo" onClick={aoExcluirConta} disabled={excluindo}>
            {excluindo ? 'Excluindo...' : 'Excluir minha conta'}
          </button>
        </div>
      </div>

      <style>{`
        .container-estreito { max-width: 640px; }
        .subtitulo-perfil { margin-bottom: 28px; }
        .titulo-secao {
          font-family: var(--fonte-corpo);
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--verde-luz);
          margin: 24px 0 16px 0;
          padding-top: 20px;
          border-top: 1px solid var(--borda-sutil);
        }
        .cartao > .titulo-secao:first-child { margin-top: 0; padding-top: 0; border-top: none; }
        .acoes-perfil { display: flex; gap: 12px; }
        .grade-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 560px) {
          .grade-2 { grid-template-columns: 1fr; }
        }
        .cartao-perigo {
          margin-top: 24px;
          border-color: rgba(229, 72, 77, 0.35);
        }
        .titulo-perigo { color: #ff9a9d; border-top: none; margin-top: 0; padding-top: 0; }
        .texto-perigo { font-size: 0.88rem; margin-bottom: 16px; }
        .botao-perigo {
          background-color: transparent;
          border: 1px solid var(--vermelho-alerta);
          color: #ff9a9d;
        }
        .botao-perigo:hover { background-color: rgba(229, 72, 77, 0.12); }
      `}</style>
    </div>
  );
}
