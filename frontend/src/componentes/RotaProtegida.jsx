import { Navigate } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
export default function RotaProtegida({ children }) {
    const { usuario, carregando } = useAutenticacao();
    if (carregando) {
        return null;
    }
    if (!usuario) {
        return <Navigate to="/login" replace/>;
    }
    return children;
}
