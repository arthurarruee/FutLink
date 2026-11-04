import { createContext, useContext, useState, useEffect } from 'react';
import api from '../servicos/api';
const AutenticacaoContexto = createContext(null);
export function AutenticacaoProvedor({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    useEffect(() => {
        // JSON.parse pode falhar se o localStorage tiver sido alterado/corrompido;
        // sem o try/catch isso derrubaria o app inteiro (tela em branco).
        try {
            const usuarioSalvo = localStorage.getItem('futlink_usuario');
            if (usuarioSalvo && localStorage.getItem('futlink_token')) {
                setUsuario(JSON.parse(usuarioSalvo));
            }
        }
        catch {
            localStorage.removeItem('futlink_usuario');
            localStorage.removeItem('futlink_token');
        }
        setCarregando(false);
        // Quando o api.js detecta token vencido, ele dispara este evento.
        const aoExpirar = () => setUsuario(null);
        window.addEventListener('futlink:sessao-expirada', aoExpirar);
        return () => window.removeEventListener('futlink:sessao-expirada', aoExpirar);
    }, []);
    const entrar = async (email, senha) => {
        const resposta = await api.post('/auth/login', { email, senha });
        const { token, usuario: dadosUsuario } = resposta.data;
        localStorage.setItem('futlink_token', token);
        localStorage.setItem('futlink_usuario', JSON.stringify(dadosUsuario));
        setUsuario(dadosUsuario);
        return dadosUsuario;
    };
    const registrar = async (nome, email, senha, tipo) => {
        const resposta = await api.post('/auth/registrar', { nome, email, senha, tipo });
        const { token, usuario: dadosUsuario } = resposta.data;
        localStorage.setItem('futlink_token', token);
        localStorage.setItem('futlink_usuario', JSON.stringify(dadosUsuario));
        setUsuario(dadosUsuario);
        return dadosUsuario;
    };
    const sair = () => {
        localStorage.removeItem('futlink_token');
        localStorage.removeItem('futlink_usuario');
        setUsuario(null);
    };
    const atualizarUsuario = (dadosParciais) => {
        setUsuario((atual) => {
            const atualizado = { ...atual, ...dadosParciais };
            localStorage.setItem('futlink_usuario', JSON.stringify(atualizado));
            return atualizado;
        });
    };
    return (<AutenticacaoContexto.Provider value={{ usuario, carregando, entrar, registrar, sair, atualizarUsuario }}>
      {children}
    </AutenticacaoContexto.Provider>);
}
export function useAutenticacao() {
    return useContext(AutenticacaoContexto);
}
