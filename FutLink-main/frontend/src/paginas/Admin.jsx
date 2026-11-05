import { useCallback, useEffect, useState } from 'react';
import api, { mensagemDeErro } from '../servicos/api';
import { abrirArquivoPrivado, formatarTamanho } from '../servicos/arquivos';
import { Carregando, EstadoVazio, MensagemErro } from '../componentes/Estados';
import Avatar from '../componentes/Avatar';
import { IconeAlerta, IconeArquivo, IconeCheck, IconeEscudo, IconeOlho, IconeRelogio } from '../componentes/Icones';

const ABAS = [
  { id: 'pendente', rotulo: 'Pendentes', Icone: IconeRelogio },
  { id: 'aprovado', rotulo: 'Aprovados', Icone: IconeCheck },
  { id: 'recusado', rotulo: 'Recusados', Icone: IconeAlerta },
];

// Painel do administrador: analisa as comprovações profissionais enviadas pelos empresários.
// (A proteção real está no backend: sem estar em ADMIN_EMAILS, a API responde 403.)
export default function Admin() {
  const [aba, setAba] = useState('pendente');
  const [itens, setItens] = useState([]);
  const [contagem, setContagem] = useState({ pendente: 0, aprovado: 0, recusado: 0 });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [recusando, setRecusando] = useState(null); // usuarioId com o campo de motivo aberto
  const [motivo, setMotivo] = useState('');
  const [processando, setProcessando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const resposta = await api.get('/admin/verificacoes', { params: { status: aba } });
      setItens(resposta.data.itens);
      setContagem(resposta.data.contagem);
    } catch (erroRequisicao) {
      setErro(mensagemDeErro(erroRequisicao, 'Não foi possível carregar as comprovações.'));
    } finally {
      setCarregando(false);
    }
  }, [aba]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const verDocumento = async (usuarioId) => {
    setErro('');
    try {
      await abrirArquivoPrivado(`/admin/verificacoes/${usuarioId}/documento`);
    } catch (erroAbertura) {
      setErro(mensagemDeErro(erroAbertura, 'Não foi possível abrir o documento.'));
    }
  };

  const decidir = async (item, status) => {
    if (status === 'recusado' && !motivo.trim()) {
      setErro('Informe o motivo da recusa para o empresário saber o que corrigir.');
      return;
    }
    if (status === 'aprovado' && !window.confirm(`Aprovar ${item.usuario?.nome} como empresário verificado?`)) return;
    setErro('');
    setAviso('');
    setProcessando(true);
    try {
      const resposta = await api.put(`/admin/verificacoes/${item.usuarioId}`, { status, motivo });
      setAviso(resposta.data.mensagem);
      setRecusando(null);
      setMotivo('');
      await carregar();
    } catch (erroRequisicao) {
      setErro(mensagemDeErro(erroRequisicao, 'Não foi possível registrar a decisão.'));
    } finally {
      setProcessando(false);
    }
  };

  return (
    <main className="pagina">
      <div className="container container-medio">
        <p className="eyebrow-auth">Administração</p>
        <h2 className="admin-titulo"><IconeEscudo tamanho={30} /> Verificação de empresários</h2>
        <p className="subtitulo-perfil">Analise os documentos enviados. O envio nunca aprova sozinho: o selo só aparece depois da sua decisão.</p>

        <div className="admin-abas" role="tablist">
          {ABAS.map(({ id, rotulo, Icone }) => (
            <button key={id} type="button" role="tab" aria-selected={aba === id} className={`admin-aba ${aba === id ? 'ativa' : ''}`} onClick={() => { setAba(id); setRecusando(null); setAviso(''); }}>
              <Icone tamanho={16} /> {rotulo} <span className="admin-contagem">{contagem[id]}</span>
            </button>
          ))}
        </div>

        {aviso && <div className="mensagem-sucesso" role="status">{aviso}</div>}
        <MensagemErro texto={erro} aoTentarNovamente={carregar} />

        {carregando ? (
          <Carregando texto="Carregando comprovações..." />
        ) : itens.length === 0 && !erro ? (
          <EstadoVazio titulo="Nada por aqui" texto={aba === 'pendente' ? 'Nenhum documento aguardando análise.' : `Nenhuma comprovação ${aba === 'aprovado' ? 'aprovada' : 'recusada'} ainda.`} />
        ) : (
          <div className="admin-lista">
            {itens.map((item) => (
              <article key={item.usuarioId} className="cartao admin-item">
                <div className="admin-item-topo">
                  <Avatar usuarioId={item.usuarioId} nome={item.usuario?.nome || ''} tamanho={54} />
                  <div className="admin-item-info">
                    <h3>{item.usuario?.nome}</h3>
                    <p>{item.usuario?.email}</p>
                    <p>
                      {[item.usuario?.PerfilEmpresario?.empresa, item.usuario?.PerfilEmpresario?.cargo].filter(Boolean).join(' · ') || 'Perfil profissional ainda não preenchido'}
                    </p>
                  </div>
                  <span className={`badge-status badge-${item.status}`}>{item.status}</span>
                </div>

                {item.documento && (
                  <div className="admin-documento">
                    <IconeArquivo tamanho={20} />
                    <div>
                      <strong>{item.documento.nomeOriginal}</strong>
                      <span>{formatarTamanho(item.documento.tamanho)} · enviado em {new Date(item.documento.enviadoEm).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <button type="button" className="botao botao-secundario botao-pequeno" onClick={() => verDocumento(item.usuarioId)}><IconeOlho tamanho={16} /> Ver documento</button>
                  </div>
                )}

                {item.status === 'recusado' && item.motivoRecusa && <p className="admin-motivo"><strong>Motivo da recusa:</strong> {item.motivoRecusa}</p>}

                {recusando === item.usuarioId ? (
                  <div className="admin-recusa">
                    <label htmlFor={`motivo-${item.usuarioId}`}>Motivo da recusa (o empresário verá esta mensagem)</label>
                    <textarea id={`motivo-${item.usuarioId}`} maxLength={300} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: o documento está ilegível ou não comprova vínculo profissional." />
                    <div className="admin-acoes">
                      <button type="button" className="botao botao-perigo botao-pequeno" disabled={processando} onClick={() => decidir(item, 'recusado')}>Confirmar recusa</button>
                      <button type="button" className="botao botao-secundario botao-pequeno" onClick={() => { setRecusando(null); setMotivo(''); }}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="admin-acoes">
                    {item.status !== 'aprovado' && <button type="button" className="botao botao-primario botao-pequeno" disabled={processando} onClick={() => decidir(item, 'aprovado')}><IconeCheck tamanho={16} /> Aprovar</button>}
                    {item.status !== 'recusado' && <button type="button" className="botao botao-secundario botao-pequeno" disabled={processando} onClick={() => { setRecusando(item.usuarioId); setMotivo(''); setErro(''); }}>Recusar</button>}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .admin-titulo { display: flex; align-items: center; gap: 12px; color: var(--ouro); }
        .admin-abas { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .admin-aba { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 999px; border: 1px solid var(--borda-sutil); background: transparent; color: var(--cinza-aco); font-family: var(--fonte-corpo); font-weight: 600; font-size: 0.88rem; cursor: pointer; }
        .admin-aba:hover { color: var(--branco-gelo); }
        .admin-aba.ativa { color: var(--verde-neon); border-color: var(--verde-grama); background: rgba(63, 145, 66, 0.14); }
        .admin-contagem { font-family: var(--fonte-dados); font-size: 0.75rem; padding: 1px 8px; border-radius: 999px; background: rgba(242, 245, 241, 0.08); }
        .admin-lista { display: flex; flex-direction: column; gap: 16px; }
        .admin-item-topo { display: flex; align-items: center; gap: 16px; }
        .admin-item-info { flex: 1; min-width: 0; }
        .admin-item-info h3 { font-family: var(--fonte-corpo); font-weight: 700; font-size: 1.1rem; margin: 0 0 2px; color: var(--branco-gelo); }
        .admin-item-info p { margin: 0; font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; }
        .admin-documento { display: flex; align-items: center; gap: 12px; margin: 16px 0; padding: 12px 14px; border-radius: 10px; background: var(--preto-estadio); border: 1px solid var(--borda-sutil); color: var(--verde-luz); flex-wrap: wrap; }
        .admin-documento div { flex: 1; min-width: 160px; display: flex; flex-direction: column; }
        .admin-documento strong { font-size: 0.9rem; word-break: break-all; }
        .admin-documento span { font-size: 0.8rem; color: var(--cinza-aco); }
        .admin-motivo { font-size: 0.88rem; color: #ff9a9d; }
        .admin-acoes { display: flex; gap: 10px; flex-wrap: wrap; }
        .admin-recusa label { display: block; font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--cinza-aco); margin-bottom: 8px; }
        .admin-recusa textarea { width: 100%; min-height: 80px; margin-bottom: 12px; background: var(--preto-estadio); border: 1px solid var(--borda-sutil); border-radius: 9px; padding: 12px; color: var(--branco-gelo); font-family: var(--fonte-corpo); font-size: 0.95rem; resize: vertical; outline: none; }
        .admin-recusa textarea:focus { border-color: var(--verde-grama); }
        .badge-status { text-transform: capitalize; }
        @media (max-width: 560px) { .admin-item-topo { flex-wrap: wrap; } }
      `}</style>
    </main>
  );
}
