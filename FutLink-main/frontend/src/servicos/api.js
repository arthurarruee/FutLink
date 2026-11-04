import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    // No plano gratuito do Render a API "dorme" após alguns minutos sem uso e a primeira
    // chamada pode levar de 30 a 60 segundos para acordar. O timeout garante que a tela
    // nunca fique "carregando para sempre": depois de 60s a requisição falha e mostramos o erro.
    timeout: 60000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('futlink_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Se a API responder 401 (token vencido/inválido) fora das telas de login/cadastro,
// limpamos a sessão e avisamos o app para mandar a pessoa para o login.
api.interceptors.response.use((resposta) => resposta, (erro) => {
    const url = erro.config?.url || '';
    const ehRotaDeAuth = url.startsWith('/auth/');
    if (erro.response?.status === 401 && !ehRotaDeAuth && localStorage.getItem('futlink_token')) {
        localStorage.removeItem('futlink_token');
        localStorage.removeItem('futlink_usuario');
        sessionStorage.setItem('futlink_sessao_expirada', '1');
        window.dispatchEvent(new Event('futlink:sessao-expirada'));
    }
    return Promise.reject(erro);
});

// Transforma qualquer erro de requisição em uma mensagem amigável.
export function mensagemDeErro(erro, padrao = 'Algo deu errado. Tente novamente.') {
    if (erro?.response?.data?.mensagem) return erro.response.data.mensagem;
    if (erro?.code === 'ECONNABORTED') return 'O servidor demorou para responder. Tente de novo em instantes.';
    if (!erro?.response) return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.';
    return padrao;
}

export default api;
