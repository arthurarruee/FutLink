import { IconeBola, IconeChat, IconeEscudo, IconeVideo } from './Icones';

// Painel lateral das telas de login e cadastro (some no celular para dar espaço ao formulário).
export default function PainelAuth({ titulo }) {
  return (
    <aside className="painel-auth">
      <span className="painel-auth-logo"><IconeBola tamanho={26} /></span>
      <h2>{titulo}</h2>
      <p>O FutLink conecta atletas de base a empresários e olheiros em todo o Brasil.</p>
      <ul>
        <li><IconeVideo tamanho={20} /> Portfólio com vídeos do YouTube</li>
        <li><IconeChat tamanho={20} /> Conversa liberada após o match</li>
        <li><IconeEscudo tamanho={20} /> Empresários com perfil verificado</li>
      </ul>
      <style>{`
        .pagina-auth { display: flex; align-items: center; }
        .auth-grade { display: grid; grid-template-columns: 1fr 440px; gap: 56px; align-items: center; width: 100%; max-width: 1040px; }
        .cartao-auth { width: 100%; padding: 32px; box-shadow: var(--sombra-cartao); }
        .cartao-auth h2 { margin-bottom: 22px; }
        .cartao-auth-rodape { text-align: center; font-size: 0.88rem; margin: 18px 0 0; }
        .painel-auth h2 { font-size: 2.2rem; margin: 20px 0 14px; }
        .painel-auth > p { font-size: 1.02rem; max-width: 420px; }
        .painel-auth-logo { width: 52px; height: 52px; border-radius: 15px; display: grid; place-items: center; color: #06100a; background: linear-gradient(135deg, var(--verde-neon), var(--verde-grama)); box-shadow: 0 8px 24px rgba(63, 145, 66, 0.4); }
        .painel-auth ul { list-style: none; padding: 0; margin: 28px 0 0; display: flex; flex-direction: column; gap: 14px; }
        .painel-auth li { display: flex; align-items: center; gap: 12px; color: var(--branco-gelo); font-size: 0.95rem; }
        .painel-auth li svg { color: var(--verde-neon); flex-shrink: 0; }
        @media (max-width: 900px) { .auth-grade { grid-template-columns: 1fr; max-width: 460px; } .painel-auth { display: none; } .pagina-auth { align-items: flex-start; } }
        @media (max-width: 480px) { .cartao-auth { padding: 22px; } }
      `}</style>
    </aside>
  );
}
