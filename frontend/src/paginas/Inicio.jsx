import { Link } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
export default function Inicio() {
    const { usuario } = useAutenticacao();
    return (<div className="pagina">
      <div className="container pagina-inicio">
        <p className="eyebrow">Base do futebol brasileiro, do bairro pro profissional</p>
        <h1 className="titulo-hero">
          O portfólio que leva
          <br />
          seu talento até o <span>olheiro certo</span>
        </h1>
        <p className="subtitulo-hero">
          FutLink conecta atletas de base a empresários e olheiros de todo o país,
          através de um perfil completo e vídeos direto do campo.
        </p>

        {!usuario && (<div className="pagina-inicio-acoes">
            <Link to="/cadastro" className="botao botao-primario">
              Criar meu portfólio
            </Link>
            <Link to="/login" className="botao botao-secundario">
              Já tenho conta
            </Link>
          </div>)}

        <div className="pagina-inicio-placar">
          <div>
            <span className="numero">01</span>
            <p>Crie seu perfil completo, com posição, clube e histórico</p>
          </div>
          <div>
            <span className="numero">02</span>
            <p>Divulgue vídeos do YouTube direto no seu portfólio</p>
          </div>
          <div>
            <span className="numero">03</span>
            <p>Seja encontrado por empresários buscando talentos como você</p>
          </div>
        </div>
      </div>

      <style>{`
        .pagina-inicio {
          padding-top: 64px;
          max-width: 760px;
        }
        .eyebrow {
          font-family: var(--fonte-dados);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--verde-luz);
          margin-bottom: 16px;
        }
        .titulo-hero {
          font-size: 3.2rem;
          line-height: 1.05;
          color: var(--branco-gelo);
        }
        .titulo-hero span {
          color: var(--verde-grama);
        }
        .subtitulo-hero {
          font-size: 1.1rem;
          max-width: 520px;
          margin-top: 20px;
        }
        .pagina-inicio-acoes {
          display: flex;
          gap: 14px;
          margin-top: 32px;
        }
        .pagina-inicio-placar {
          margin-top: 80px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          border-top: 1px solid var(--borda-sutil);
          padding-top: 32px;
        }
        .pagina-inicio-placar .numero {
          font-family: var(--fonte-destaque);
          font-size: 1.8rem;
          color: var(--verde-copa);
          -webkit-text-stroke: 1px var(--verde-grama);
        }
        .pagina-inicio-placar p {
          margin-top: 8px;
          font-size: 0.92rem;
        }
        @media (max-width: 720px) {
          .titulo-hero { font-size: 2.2rem; }
          .pagina-inicio-placar { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>);
}
