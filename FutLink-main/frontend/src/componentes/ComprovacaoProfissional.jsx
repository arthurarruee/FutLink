import { useCallback, useEffect, useRef, useState } from 'react';
import api, { mensagemDeErro } from '../servicos/api';
import { abrirArquivoPrivado, enviarDocumento, formatarTamanho, validarDocumento } from '../servicos/arquivos';
import { Carregando, MensagemErro } from './Estados';
import { IconeAlerta, IconeArquivo, IconeCadeado, IconeCheck, IconeEscudo, IconeLixeira, IconeOlho, IconeRelogio, IconeUpload } from './Icones';

const STATUS = {
  pendente: { rotulo: 'Pendente de análise', Icone: IconeRelogio, texto: 'Recebemos seu documento. Nossa equipe vai analisá-lo — você será marcado como verificado quando for aprovado.' },
  aprovado: { rotulo: 'Aprovado', Icone: IconeCheck, texto: 'Seu documento foi aprovado. Seu perfil exibe o selo de verificado para atletas e outros usuários.' },
  recusado: { rotulo: 'Recusado', Icone: IconeAlerta, texto: 'Seu documento não foi aprovado. Veja o motivo abaixo e envie um novo documento.' },
};

// Seção "Comprovação Profissional" do perfil do empresário.
export default function ComprovacaoProfissional() {
  const inputRef = useRef(null);
  const [dados, setDados] = useState(null); // { status, documento, motivoRecusa } ou null enquanto carrega
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregar = useCallback(async () => {
    try {
      const resposta = await api.get('/arquivos/comprovacao/me');
      setDados(resposta.data);
    } catch (erroRequisicao) {
      setErro(mensagemDeErro(erroRequisicao, 'Não foi possível carregar sua comprovação.'));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const aoEscolher = async (evento) => {
    const arquivo = evento.target.files?.[0];
    evento.target.value = '';
    if (!arquivo) return;
    setErro('');
    setSucesso('');
    const problema = validarDocumento(arquivo);
    if (problema) return setErro(problema);
    setProcessando(true);
    try {
      await enviarDocumento(arquivo);
      setSucesso('Documento enviado! Agora ele aguarda a análise da nossa equipe.');
      await carregar();
    } catch (erroEnvio) {
      setErro(mensagemDeErro(erroEnvio, 'Não foi possível enviar o documento.'));
    } finally {
      setProcessando(false);
    }
  };

  const aoVisualizar = async () => {
    setErro('');
    try {
      await abrirArquivoPrivado('/arquivos/comprovacao/arquivo');
    } catch (erroAbertura) {
      setErro(mensagemDeErro(erroAbertura, 'Não foi possível abrir o documento.'));
    }
  };

  const aoRemover = async () => {
    if (!window.confirm('Remover o documento? Seu selo de verificado também será removido.')) return;
    setErro('');
    setSucesso('');
    setProcessando(true);
    try {
      await api.delete('/arquivos/comprovacao');
      setSucesso('Documento removido.');
      await carregar();
    } catch (erroRemocao) {
      setErro(mensagemDeErro(erroRemocao, 'Não foi possível remover o documento.'));
    } finally {
      setProcessando(false);
    }
  };

  const temDocumento = Boolean(dados?.documento);
  const info = temDocumento ? STATUS[dados.status] : null;

  return (
    <section className="cartao comprovacao" aria-labelledby="titulo-comprovacao">
      <div className="comprovacao-cabecalho">
        <span className="comprovacao-icone"><IconeEscudo tamanho={22} /></span>
        <div>
          <h3 id="titulo-comprovacao" className="comprovacao-titulo">Comprovação Profissional</h3>
          <p>Envie um documento que comprove seu vínculo com um clube ou sua atuação como empresário (ex.: contrato, credencial, registro). Perfis aprovados recebem o selo <strong>Verificado</strong>.</p>
        </div>
      </div>

      <MensagemErro texto={erro} />
      {sucesso && <div className="mensagem-sucesso" role="status">{sucesso}</div>}

      {carregando ? (
        <Carregando texto="Carregando..." />
      ) : !temDocumento ? (
        <button type="button" className="zona-upload" onClick={() => inputRef.current?.click()} disabled={processando}>
          <IconeUpload tamanho={28} />
          <strong>{processando ? 'Enviando...' : 'Enviar documento'}</strong>
          <span>PDF, JPG, PNG ou WEBP · até 5 MB</span>
        </button>
      ) : (
        <div className={`comprovacao-documento status-${dados.status}`}>
          <div className="comprovacao-status">
            <span className={`badge-status badge-${dados.status}`}><info.Icone tamanho={14} /> {info.rotulo}</span>
            <p>{info.texto}</p>
            {dados.status === 'recusado' && dados.motivoRecusa && (
              <p className="comprovacao-motivo"><strong>Motivo:</strong> {dados.motivoRecusa}</p>
            )}
          </div>
          <div className="comprovacao-arquivo">
            <IconeArquivo tamanho={22} />
            <div>
              <strong>{dados.documento.nomeOriginal}</strong>
              <span>{formatarTamanho(dados.documento.tamanho)} · enviado em {new Date(dados.documento.enviadoEm).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          <div className="comprovacao-acoes">
            <button type="button" className="botao botao-secundario botao-pequeno" onClick={aoVisualizar}><IconeOlho tamanho={16} /> Ver documento</button>
            <button type="button" className="botao botao-secundario botao-pequeno" onClick={() => inputRef.current?.click()} disabled={processando}><IconeUpload tamanho={16} /> Substituir</button>
            <button type="button" className="botao botao-secundario botao-pequeno" onClick={aoRemover} disabled={processando}><IconeLixeira tamanho={16} /> Remover</button>
          </div>
          {dados.status !== 'recusado' && <p className="comprovacao-aviso">Ao substituir o documento, a análise recomeça do zero.</p>}
        </div>
      )}

      <input ref={inputRef} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" hidden onChange={aoEscolher} />
      <p className="comprovacao-privacidade"><IconeCadeado tamanho={14} /> Seu documento é privado: só você e a equipe de análise do FutLink conseguem abri-lo.</p>

      <style>{`
        .comprovacao { margin-top: 24px; }
        .comprovacao-cabecalho { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
        .comprovacao-cabecalho p { font-size: 0.9rem; margin: 0; }
        .comprovacao-titulo { font-family: var(--fonte-corpo); font-size: 1.1rem; margin: 0 0 6px; color: var(--branco-gelo); }
        .comprovacao-icone { flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; background: rgba(233, 196, 106, 0.12); color: var(--ouro); border: 1px solid rgba(233, 196, 106, 0.35); }
        .zona-upload { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 32px 16px; border: 2px dashed var(--borda-sutil); border-radius: var(--raio-padrao); background: var(--preto-estadio); color: var(--cinza-aco); font-family: var(--fonte-corpo); cursor: pointer; transition: border-color .15s, color .15s; }
        .zona-upload:hover:not(:disabled) { border-color: var(--verde-grama); color: var(--verde-luz); }
        .zona-upload strong { color: var(--branco-gelo); }
        .zona-upload span { font-size: 0.82rem; }
        .comprovacao-documento { border: 1px solid var(--borda-sutil); border-radius: var(--raio-padrao); padding: 18px; background: var(--preto-estadio); }
        .comprovacao-status p { font-size: 0.9rem; margin: 10px 0 0; }
        .comprovacao-motivo { color: #ff9a9d !important; }
        .comprovacao-arquivo { display: flex; align-items: center; gap: 12px; margin: 16px 0; padding: 12px 14px; border-radius: 8px; background: var(--preto-cartao); border: 1px solid var(--borda-sutil); color: var(--verde-luz); min-width: 0; }
        .comprovacao-arquivo div { display: flex; flex-direction: column; min-width: 0; }
        .comprovacao-arquivo strong { color: var(--branco-gelo); font-size: 0.92rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .comprovacao-arquivo span { color: var(--cinza-aco); font-size: 0.8rem; }
        .comprovacao-acoes { display: flex; gap: 10px; flex-wrap: wrap; }
        .comprovacao-aviso { font-size: 0.8rem; margin: 12px 0 0; }
        .comprovacao-privacidade { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; margin: 16px 0 0; }
        .comprovacao .mensagem-erro, .comprovacao .mensagem-sucesso { margin-bottom: 16px; }
      `}</style>
    </section>
  );
}
