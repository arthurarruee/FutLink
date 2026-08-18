import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
export default function Login() {
    const { entrar } = useAutenticacao();
    const navegar = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);
    const aoEnviar = async (evento) => {
        evento.preventDefault();
        setErro('');
        setEnviando(true);
        try {
            const usuario = await entrar(email, senha);
            navegar(usuario.tipo === 'empresario' ? '/pesquisa' : '/perfil');
        }
        catch (erroRequisicao) {
            setErro(erroRequisicao.response?.data?.mensagem || 'Não foi possível fazer login.');
        }
        finally {
            setEnviando(false);
        }
    };
    return (<div className="pagina pagina-auth">
      <div className="container">
        <form className="cartao cartao-auth" onSubmit={aoEnviar}>
          <p className="eyebrow-auth">Bem-vindo de volta</p>
          <h2>Entrar</h2>

          {erro && <div className="mensagem-erro">{erro}</div>}

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus/>
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required/>
          </div>

          <button className="botao botao-primario botao-bloco" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="cartao-auth-rodape">
            Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
          </p>
        </form>
      </div>

      <style>{`
        .pagina-auth {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cartao-auth {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }
        .eyebrow-auth {
          font-family: var(--fonte-dados);
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--verde-luz);
          margin-bottom: 4px;
        }
        .cartao-auth h2 {
          margin-bottom: 24px;
        }
        .cartao-auth-rodape {
          text-align: center;
          font-size: 0.88rem;
          margin-top: 16px;
          margin-bottom: 0;
        }
      `}</style>
    </div>);
}
