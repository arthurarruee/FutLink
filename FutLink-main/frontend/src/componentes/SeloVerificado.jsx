import { IconeEscudo } from './Icones';

// Selo exibido SOMENTE quando o administrador aprovou a comprovação profissional.
export default function SeloVerificado({ compacto = false }) {
  return (
    <span className={`selo-verificado ${compacto ? 'compacto' : ''}`} title="Perfil verificado: documento profissional aprovado pela equipe do FutLink">
      <IconeEscudo tamanho={compacto ? 14 : 16} />
      {!compacto && 'Verificado'}
    </span>
  );
}
