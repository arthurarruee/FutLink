import { Navigate } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';

// Só deixa entrar quem está logado.
//   tipos={['empresario']}  -> só esse tipo de usuário
//   somenteAdmin            -> só administradores
// Atenção: isso apenas ESCONDE a tela. Quem realmente protege os dados é o backend.
export default function RotaProtegida({ children, tipos, somenteAdmin = false }) {
    const { usuario, carregando } = useAutenticacao();
    if (carregando) {
        return null;
    }
    if (!usuario) {
        return <Navigate to="/login" replace/>;
    }
    if ((tipos && !tipos.includes(usuario.tipo)) || (somenteAdmin && !usuario.admin)) {
        return <Navigate to="/" replace/>;
    }
    return children;
}
