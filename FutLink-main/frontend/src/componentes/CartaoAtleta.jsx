import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { IconeSeta } from './Icones';
import ResumoAtleta from './ResumoAtleta';

// Cartão de atleta usado na pesquisa. Clicar leva ao perfil completo.
export default function CartaoAtleta({ perfil }) {
    const nome = perfil.Usuario?.nome || 'Atleta';
    return (<Link to={`/atleta/${perfil.usuarioId}`} className="cartao cartao-atleta">
      <Avatar usuarioId={perfil.usuarioId} nome={nome} tamanho={64}/>
      <div className="cartao-atleta-info">
        <h3>{nome}</h3>
        <ResumoAtleta perfil={perfil}/>
      </div>
      <span className="cartao-atleta-seta" aria-hidden="true"><IconeSeta tamanho={20}/></span>

      <style>{`
        .cartao-atleta { display: flex; align-items: center; gap: 18px; padding: 18px 20px; transition: border-color .15s ease, transform .15s ease, background-color .15s ease; }
        .cartao-atleta:hover { border-color: var(--verde-grama); transform: translateY(-2px); background: var(--preto-cartao-hover); }
        .cartao-atleta-info { flex: 1; min-width: 0; }
        .cartao-atleta-info h3 { font-family: var(--fonte-corpo); font-weight: 700; font-size: 1.1rem; color: var(--branco-gelo); margin: 0 0 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cartao-atleta-seta { color: var(--cinza-aco); transition: transform .15s, color .15s; }
        .cartao-atleta:hover .cartao-atleta-seta { color: var(--verde-neon); transform: translateX(4px); }
        @media (max-width: 480px) { .cartao-atleta { gap: 12px; padding: 14px; } .cartao-atleta-seta { display: none; } }
      `}</style>
    </Link>);
}
