import { Link } from 'react-router-dom';
export default function CartaoAtleta({ perfil }) {
    const nome = perfil.Usuario?.nome || 'Atleta';
    const iniciais = nome
        .split(' ')
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase();
    return (<Link to={`/atleta/${perfil.usuarioId}`} className="cartao cartao-atleta">
      <div className="numero-camisa">{iniciais}</div>
      <div className="cartao-atleta-info">
        <h3>{nome}</h3>
        <p className="cartao-atleta-dados">
          {perfil.posicao || 'Posição não informada'}
          {perfil.idade ? ` · ${perfil.idade} anos` : ''}
          {perfil.cidade ? ` · ${perfil.cidade}${perfil.estado ? '/' + perfil.estado : ''}` : ''}
        </p>
      </div>

      <style>{`
        .cartao-atleta {
          display: flex;
          align-items: center;
          gap: 16px;
          transition: border-color 0.15s ease, background-color 0.15s ease;
        }
        .cartao-atleta:hover {
          border-color: var(--verde-grama);
          background-color: var(--preto-cartao-hover);
        }
        .cartao-atleta-info h3 {
          font-family: var(--fonte-corpo);
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--branco-gelo);
          margin: 0 0 4px 0;
        }
        .cartao-atleta-dados {
          font-family: var(--fonte-dados);
          font-size: 0.82rem;
          color: var(--verde-luz);
          margin: 0;
        }
      `}</style>
    </Link>);
}
