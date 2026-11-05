import { useRef, useState } from 'react';
import Avatar from './Avatar';
import { IconeCamera, IconeLixeira } from './Icones';
import { enviarFoto, removerFoto } from '../servicos/arquivos';
import { mensagemDeErro } from '../servicos/api';
import { MensagemErro } from './Estados';

// Bloco "Foto de perfil": mostra a foto atual e permite enviar, trocar ou remover.
export default function SeletorFoto({ usuario }) {
  const inputRef = useRef(null);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const aoEscolher = async (evento) => {
    const arquivo = evento.target.files?.[0];
    evento.target.value = ''; // permite escolher o mesmo arquivo de novo depois
    if (!arquivo) return;
    setErro('');
    setSucesso('');
    setProcessando(true);
    try {
      await enviarFoto(arquivo, usuario.id);
      setSucesso('Foto atualizada!');
    } catch (erroEnvio) {
      // erros de validação local têm "message"; erros da API vêm em response.data.mensagem
      setErro(erroEnvio.response ? mensagemDeErro(erroEnvio) : erroEnvio.message || 'Não foi possível enviar a foto.');
    } finally {
      setProcessando(false);
    }
  };

  const aoRemover = async () => {
    if (!window.confirm('Remover sua foto de perfil?')) return;
    setErro('');
    setSucesso('');
    setProcessando(true);
    try {
      await removerFoto(usuario.id);
      setSucesso('Foto removida.');
    } catch (erroRemocao) {
      setErro(mensagemDeErro(erroRemocao, 'Não foi possível remover a foto.'));
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="seletor-foto">
      <div className="seletor-foto-linha">
        <Avatar usuarioId={usuario.id} nome={usuario.nome} tamanho={104} />
        <div className="seletor-foto-acoes">
          <h3 className="seletor-foto-titulo">Foto de perfil</h3>
          <p>JPG, PNG ou WEBP. Ela aparece no seu perfil, nas pesquisas e nas conversas.</p>
          <div className="seletor-foto-botoes">
            <button type="button" className="botao botao-primario botao-pequeno" onClick={() => inputRef.current?.click()} disabled={processando}>
              <IconeCamera tamanho={16} /> {processando ? 'Enviando...' : 'Alterar foto'}
            </button>
            <button type="button" className="botao botao-secundario botao-pequeno" onClick={aoRemover} disabled={processando}>
              <IconeLixeira tamanho={16} /> Remover
            </button>
          </div>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={aoEscolher} />
      <MensagemErro texto={erro} />
      {sucesso && <div className="mensagem-sucesso" role="status">{sucesso}</div>}

      <style>{`
        .seletor-foto-linha { display: flex; align-items: center; gap: 22px; }
        .seletor-foto-titulo { font-family: var(--fonte-corpo); font-size: 1.05rem; margin: 0 0 4px; color: var(--branco-gelo); }
        .seletor-foto-acoes p { font-size: 0.88rem; margin-bottom: 12px; }
        .seletor-foto-botoes { display: flex; gap: 10px; flex-wrap: wrap; }
        .seletor-foto .mensagem-erro, .seletor-foto .mensagem-sucesso { margin: 16px 0 0; }
        @media (max-width: 520px) { .seletor-foto-linha { flex-direction: column; text-align: center; } .seletor-foto-botoes { justify-content: center; } }
      `}</style>
    </div>
  );
}
