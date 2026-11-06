import { IconeMapa } from './Icones';

// Resumo do atleta (posição, idade, pé dominante, cidade/estado e clube atual).
// É usado nos cards da Pesquisa E da página Interesses, então os dois sempre mostram o mesmo padrão
// e os mesmos dados do perfil que o empresário usa nos filtros.
export default function ResumoAtleta({ perfil }) {
    if (!perfil) {
        return <p className="resumo-atleta-vazio">Este atleta ainda não preencheu o perfil.</p>;
    }
    const local = perfil.cidade ? `${perfil.cidade}${perfil.estado ? '/' + perfil.estado : ''}` : '';
    return (<>
      <div className="resumo-atleta-chips">
        <span className="chip">{perfil.posicao || 'Posição não informada'}</span>
        {perfil.idade ? <span className="chip chip-neutro">{perfil.idade} anos</span> : null}
        {perfil.pePreferido ? <span className="chip chip-neutro">Pé {perfil.pePreferido.toLowerCase()}</span> : null}
      </div>
      {(local || perfil.clubeAtual) && (<p className="resumo-atleta-dados">
          {local && <span><IconeMapa tamanho={13}/> {local}</span>}
          {perfil.clubeAtual && <span>{perfil.clubeAtual}</span>}
        </p>)}

      <style>{`
        .resumo-atleta-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .resumo-atleta-dados { display: flex; flex-wrap: wrap; gap: 6px 16px; margin: 10px 0 0; font-size: 0.82rem; }
        .resumo-atleta-dados span { display: inline-flex; align-items: center; gap: 5px; }
        .resumo-atleta-vazio { margin: 0; font-size: 0.85rem; }
      `}</style>
    </>);
}
