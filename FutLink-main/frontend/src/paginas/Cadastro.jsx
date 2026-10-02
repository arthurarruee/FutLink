import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
export default function Cadastro() {
    const { registrar } = useAutenticacao();
    const navegar = useNavigate();
    const [tipo, setTipo] = useState('atleta');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);
    const aoEnviar = async (evento) => {
        evento.preventDefault();
        setErro('');
        setEnviando(true);
        try {
            await registrar(nome, email, senha, tipo);
            navegar('/perfil');
        }
        catch (erroRequisicao) {
            setErro(erroRequisicao.response?.data?.mensagem || 'Não foi possível criar sua conta.');
        }
        finally {
            setEnviando(false);
        }
    };
    return (<div className="pagina pagina-auth">
      <div className="container">
        <form className="cartao cartao-auth" onSubmit={aoEnviar}>
          <p className="eyebrow-auth">Comece agora</p>
          <h2>Criar conta</h2>

          {erro && <div className="mensagem-erro">{erro}</div>}

          <div className="campo">
            <label>Eu sou</label>
            <div className="seletor-tipo">
              <button type="button" className={`seletor-tipo-opcao ${tipo === 'atleta' ? 'ativo' : ''}`} onClick={() => setTipo('atleta')}>
                Atleta
              </button>
              <button type="button" className={`seletor-tipo-opcao ${tipo === 'empresario' ? 'ativo' : ''}`} onClick={() => setTipo('empresario')}>
                Empresário / Olheiro
              </button>
            </div>
          </div>

          <div className="campo">
            <label htmlFor="nome">Nome completo</label>
            <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required autoFocus/>
          </div>

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} minLength={6} required/>
          </div>

          <button className="botao botao-primario botao-bloco" disabled={enviando}>
            {enviando ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="cartao-auth-rodape">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </div>

      <style>{`
        .seletor-tipo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .seletor-tipo-opcao {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--borda-sutil);
          background-color: var(--preto-estadio);
          color: var(--cinza-aco);
          font-family: var(--fonte-corpo);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .seletor-tipo-opcao.ativo {
          border-color: var(--verde-grama);
          background-color: rgba(63, 145, 66, 0.14);
          color: var(--verde-luz);
        }
      `}</style>
    </div>);
}
