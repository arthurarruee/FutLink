import { Link } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
import { IconeBola, IconeBusca, IconeChat, IconeEscudo, IconeEstrela, IconeSeta, IconeUsuarios, IconeVideo } from '../componentes/Icones';

const RECURSOS = [
  { Icone: IconeUsuarios, titulo: 'Perfil completo', texto: 'Posição, pé dominante, clube atual, cidade, biografia e histórico de clubes e competições em um só lugar.' },
  { Icone: IconeVideo, titulo: 'Portfólio em vídeo', texto: 'Mostre suas melhores jogadas com vídeos do YouTube direto no seu perfil, para quem procura talentos ver o seu jogo.' },
  { Icone: IconeBusca, titulo: 'Pesquisa inteligente', texto: 'Empresários e olheiros filtram atletas por nome, posição, cidade, estado e idade e chegam rápido ao perfil certo.' },
  { Icone: IconeEstrela, titulo: 'Interesse e Match', texto: 'O empresário demonstra interesse, o atleta decide. Se aceitar, os dois dão match e podem conversar.' },
  { Icone: IconeChat, titulo: 'Conversa direta', texto: 'Mensagens liberadas somente depois do match, garantindo contato com quem realmente tem interesse mútuo.' },
  { Icone: IconeEscudo, titulo: 'Empresários verificados', texto: 'Empresários podem comprovar sua atuação profissional. Após análise da nossa equipe, o perfil ganha o selo de verificado.' },
];

const PASSOS_ATLETA = ['Crie sua conta como Atleta', 'Complete o perfil e adicione sua foto', 'Publique vídeos e seu histórico esportivo', 'Aceite os interesses e converse após o match'];
const PASSOS_EMPRESARIO = ['Crie sua conta como Empresário', 'Preencha seu perfil e envie a comprovação', 'Pesquise atletas e envie interesse', 'Dê match e converse com o atleta'];

export default function Inicio() {
  const { usuario } = useAutenticacao();
  const destino = usuario ? (usuario.tipo === 'empresario' ? '/pesquisa' : '/feed') : '/cadastro';

  return (
    <main className="inicio">
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="container hero-grade">
          <div className="hero-texto">
            <p className="eyebrow-auth">Base do futebol brasileiro, do bairro pro profissional</p>
            <h1 className="titulo-hero">O portfólio que leva seu talento até o <span>olheiro certo</span></h1>
            <p className="subtitulo-hero">
              O FutLink conecta atletas de base a empresários, olheiros e clubes, através de um perfil completo,
              vídeos direto do campo e contato seguro depois do match.
            </p>
            <div className="hero-acoes">
              {usuario ? (
                <>
                  <Link to={destino} className="botao botao-primario botao-grande">{usuario.tipo === 'empresario' ? 'Pesquisar atletas' : 'Ir para meu portfólio'} <IconeSeta tamanho={18} /></Link>
                  <Link to="/perfil" className="botao botao-secundario botao-grande">Meu perfil</Link>
                </>
              ) : (
                <>
                  <Link to="/cadastro" className="botao botao-primario botao-grande">Criar meu portfólio <IconeSeta tamanho={18} /></Link>
                  <Link to="/login" className="botao botao-secundario botao-grande">Já tenho conta</Link>
                </>
              )}
            </div>
            <ul className="hero-garantias">
              <li><IconeEscudo tamanho={16} /> Perfis verificados</li>
              <li><IconeChat tamanho={16} /> Chat só após match</li>
              <li><IconeVideo tamanho={16} /> Vídeos do YouTube</li>
            </ul>
          </div>

          {/* Cartão ilustrativo (exemplo de como o perfil aparece) */}
          <div className="hero-visual" aria-hidden="true">
            <div className="exemplo-cartao">
              <span className="exemplo-etiqueta">Exemplo de perfil</span>
              <div className="exemplo-topo">
                <span className="exemplo-avatar">JS</span>
                <div>
                  <strong>João Silva</strong>
                  <span>Atacante · 17 anos · Porto Alegre/RS</span>
                </div>
              </div>
              <div className="exemplo-chips">
                <span className="chip">Pé direito</span>
                <span className="chip">Sub-17</span>
                <span className="chip">3 vídeos</span>
              </div>
              <div className="exemplo-video"><IconeVideo tamanho={34} /></div>
              <div className="exemplo-barra"><span>Interesse recebido</span><b>Novo</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- RECURSOS ---------------- */}
      <section className="secao-landing">
        <div className="container">
          <div className="secao-titulo">
            <p className="eyebrow-auth">Tudo em um só lugar</p>
            <h2>Uma plataforma completa para atletas e olheiros</h2>
          </div>
          <div className="recursos-grade">
            {RECURSOS.map(({ Icone, titulo, texto }) => (
              <article key={titulo} className="cartao recurso">
                <span className="recurso-icone"><Icone tamanho={22} /></span>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- COMO FUNCIONA ---------------- */}
      <section className="secao-landing secao-escura">
        <div className="container">
          <div className="secao-titulo">
            <p className="eyebrow-auth">Como funciona</p>
            <h2>Do cadastro ao match em poucos passos</h2>
          </div>
          <div className="passos-grade">
            <div className="cartao passos">
              <h3><IconeBola tamanho={20} /> Para atletas</h3>
              <ol>{PASSOS_ATLETA.map((passo, i) => (<li key={passo}><span className="passo-numero">{String(i + 1).padStart(2, '0')}</span>{passo}</li>))}</ol>
            </div>
            <div className="cartao passos">
              <h3><IconeBusca tamanho={20} /> Para empresários e olheiros</h3>
              <ol>{PASSOS_EMPRESARIO.map((passo, i) => (<li key={passo}><span className="passo-numero">{String(i + 1).padStart(2, '0')}</span>{passo}</li>))}</ol>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CHAMADA FINAL ---------------- */}
      <section className="secao-landing">
        <div className="container">
          <div className="chamada-final">
            <div>
              <h2>Pronto para entrar em campo?</h2>
              <p>Crie sua conta gratuitamente ou visite a Central de Ajuda para entender cada passo.</p>
            </div>
            <div className="hero-acoes">
              {!usuario && <Link to="/cadastro" className="botao botao-primario botao-grande">Criar conta</Link>}
              <Link to="/ajuda" className="botao botao-secundario botao-grande">Central de Ajuda</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero { padding: 72px 0 56px; position: relative; overflow: hidden; }
        .hero::after { content: ''; position: absolute; left: 50%; bottom: -160px; width: 720px; height: 320px; transform: translateX(-50%); border: 2px solid rgba(242, 245, 241, 0.05); border-radius: 50%; pointer-events: none; }
        .hero-grade { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 56px; align-items: center; }
        .titulo-hero { font-size: 3.3rem; line-height: 1.04; color: var(--branco-gelo); margin-bottom: 20px; }
        .titulo-hero span { color: var(--verde-neon); }
        .subtitulo-hero { font-size: 1.1rem; max-width: 540px; }
        .hero-acoes { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 30px; }
        .hero-garantias { list-style: none; display: flex; gap: 22px; flex-wrap: wrap; margin: 30px 0 0; padding: 0; }
        .hero-garantias li { display: flex; align-items: center; gap: 8px; color: var(--cinza-aco); font-size: 0.88rem; }
        .hero-garantias svg { color: var(--verde-grama); }

        .hero-visual { display: flex; justify-content: center; }
        .exemplo-cartao { position: relative; width: 100%; max-width: 380px; padding: 24px; border-radius: 22px; background: linear-gradient(160deg, #18211a, #101510); border: 1px solid var(--borda-forte); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(63, 145, 66, 0.15); transform: rotate(1.5deg); }
        .exemplo-etiqueta { position: absolute; top: -12px; right: 18px; padding: 3px 12px; border-radius: 999px; background: var(--ouro); color: #1a1405; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
        .exemplo-topo { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .exemplo-topo > div { display: flex; flex-direction: column; }
        .exemplo-topo span:last-child { color: var(--verde-luz); font-family: var(--fonte-dados); font-size: 0.76rem; }
        .exemplo-avatar { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; background: var(--verde-copa); border: 2px solid var(--verde-grama); font-family: var(--fonte-destaque); font-size: 1.1rem; }
        .exemplo-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
        .exemplo-video { height: 130px; border-radius: 14px; display: grid; place-items: center; color: var(--verde-luz); background: repeating-linear-gradient(90deg, rgba(63, 145, 66, 0.18) 0 40px, rgba(63, 145, 66, 0.1) 40px 80px); border: 1px solid var(--borda-sutil); }
        .exemplo-barra { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding: 10px 14px; border-radius: 10px; background: rgba(63, 145, 66, 0.12); font-size: 0.85rem; color: var(--verde-luz); }
        .exemplo-barra b { background: var(--verde-neon); color: #06100a; padding: 2px 10px; border-radius: 999px; font-size: 0.72rem; }

        .secao-landing { padding: 72px 0; }
        .secao-escura { background: rgba(5, 8, 6, 0.55); border-top: 1px solid var(--borda-sutil); border-bottom: 1px solid var(--borda-sutil); }
        .secao-titulo { max-width: 640px; margin-bottom: 36px; }
        .secao-titulo h2 { font-size: 2.1rem; }
        .recursos-grade { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .recurso { transition: transform .2s ease, border-color .2s ease; }
        .recurso:hover { transform: translateY(-4px); border-color: var(--verde-grama); }
        .recurso h3 { font-family: var(--fonte-corpo); font-weight: 700; font-size: 1.1rem; color: var(--branco-gelo); margin: 16px 0 8px; }
        .recurso p { font-size: 0.92rem; margin: 0; }
        .recurso-icone { width: 48px; height: 48px; border-radius: 13px; display: grid; place-items: center; color: var(--verde-neon); background: rgba(63, 145, 66, 0.14); border: 1px solid rgba(63, 145, 66, 0.35); }
        .passos-grade { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .passos h3 { display: flex; align-items: center; gap: 10px; font-family: var(--fonte-corpo); font-weight: 700; font-size: 1.15rem; color: var(--verde-luz); margin-bottom: 20px; }
        .passos ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
        .passos li { display: flex; align-items: center; gap: 16px; color: var(--branco-gelo); }
        .passo-numero { font-family: var(--fonte-destaque); font-size: 1.5rem; color: var(--verde-copa); -webkit-text-stroke: 1px var(--verde-grama); min-width: 40px; }
        .chamada-final { display: flex; align-items: center; justify-content: space-between; gap: 28px; flex-wrap: wrap; padding: 40px; border-radius: 22px; border: 1px solid rgba(63, 145, 66, 0.4); background: radial-gradient(circle at 0% 0%, rgba(63, 145, 66, 0.25), transparent 60%), var(--preto-cartao); }
        .chamada-final h2 { margin-bottom: 8px; }
        .chamada-final p { margin: 0; }
        .chamada-final .hero-acoes { margin-top: 0; }

        @media (max-width: 960px) {
          .hero-grade { grid-template-columns: 1fr; gap: 44px; }
          .titulo-hero { font-size: 2.6rem; }
          .recursos-grade { grid-template-columns: 1fr 1fr; }
          .passos-grade { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .hero { padding: 40px 0 32px; }
          .titulo-hero { font-size: 2.05rem; }
          .recursos-grade { grid-template-columns: 1fr; }
          .secao-landing { padding: 48px 0; }
          .secao-titulo h2 { font-size: 1.6rem; }
          .chamada-final { padding: 26px; }
          .hero-acoes .botao { flex: 1; }
        }
      `}</style>
    </main>
  );
}
