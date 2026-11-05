import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
import { mensagemDeErro } from '../servicos/api';
import PainelAuth from '../componentes/PainelAuth';
import { IconeBola, IconeBusca } from '../componentes/Icones';
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
            setErro(mensagemDeErro(erroRequisicao, 'Não foi possível criar sua conta.'));
        }
        finally {
            setEnviando(false);
        }
    };
    return (<div className="pagina pagina-auth">
      <div className="container auth-grade">
        <PainelAuth titulo="Crie sua conta e entre em campo" />
        <form className="cartao cartao-auth" onSubmit={aoEnviar}>
          <p className="eyebrow-auth">Comece agora</p>
          <h2>Criar conta</h2>

          {erro && <div className="mensagem-erro" role="alert">{erro}</div>}

          <div className="campo">
            <label>Eu sou</label>
            <div className="seletor-tipo">
              <button type="button" className={`seletor-tipo-opcao ${tipo === 'atleta' ? 'ativo' : ''}`} onClick={() => setTipo('atleta')} aria-pressed={tipo === 'atleta'}>
                <IconeBola tamanho={22}/>
                <strong>Atleta</strong>
                <span>Quero ser descoberto</span>
              </button>
              <button type="button" className={`seletor-tipo-opcao ${tipo === 'empresario' ? 'ativo' : ''}`} onClick={() => setTipo('empresario')} aria-pressed={tipo === 'empresario'}>
                <IconeBusca tamanho={22}/>
                <strong>Empresário / Olheiro</strong>
                <span>Quero encontrar talentos</span>
              </button>
            </div>
          </div>

          <div className="campo">
            <label htmlFor="nome">Nome completo</label>
            <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required autoFocus/>
          </div>

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} minLength={6} required/>
            <small className="dica-campo">Mínimo de 6 caracteres.</small>
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
        .seletor-tipo { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .seletor-tipo-opcao { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 16px 10px; border-radius: 12px; border: 1px solid var(--borda-sutil); background-color: var(--preto-estadio); color: var(--cinza-aco); font-family: var(--fonte-corpo); cursor: pointer; transition: all .15s ease; text-align: center; }
        .seletor-tipo-opcao strong { color: var(--branco-gelo); font-size: 0.92rem; }
        .seletor-tipo-opcao span { font-size: 0.76rem; }
        .seletor-tipo-opcao:hover { border-color: var(--borda-forte); }
        .seletor-tipo-opcao.ativo { border-color: var(--verde-grama); background-color: rgba(63, 145, 66, 0.14); color: var(--verde-neon); box-shadow: 0 0 0 3px rgba(63, 145, 66, 0.18); }
      `}</style>
    </div>);
}
