import { createContext, useContext, useState, useEffect } from 'react';
import api from '../servicos/api';
const AutenticacaoContexto = createContext(null);
export function AutenticacaoProvedor({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    useEffect(() => {
        const usuarioSalvo = localStorage.getItem('futlink_usuario');
        if (usuarioSalvo) {
            setUsuario(JSON.parse(usuarioSalvo));
        }
        setCarregando(false);
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
