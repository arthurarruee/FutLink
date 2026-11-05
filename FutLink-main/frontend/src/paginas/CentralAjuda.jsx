import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAutenticacao } from '../contexto/AutenticacaoContexto';
import { IconeAjuda, IconeBola, IconeBusca, IconeCheck, IconeChat, IconeEscudo, IconeEstrela, IconeUsuario, IconeVideo } from '../componentes/Icones';

// Todo o conteúdo da Central de Ajuda fica neste array: para mudar um texto (ou criar um tópico novo),
// basta editar aqui. Cada tópico tem: titulo, descricao, passos (opcional), exemplo (opcional).
const CATEGORIAS = [
  {
    id: 'primeiros-passos', titulo: 'Primeiros passos', Icone: IconeBola,
    resumo: 'Entenda o que é o FutLink e como criar sua conta.',
    topicos: [
      {
        titulo: 'O que é o FutLink?',
        descricao: 'O FutLink é uma plataforma que conecta jogadores de futebol de base a empresários, olheiros e clubes. O atleta monta um perfil completo com vídeos e histórico esportivo; o empresário pesquisa talentos, demonstra interesse e, se o atleta aceitar, os dois podem conversar.',
        exemplo: 'Um jogador sub-17 de Porto Alegre publica três vídeos de gols. Um olheiro de outro estado encontra o perfil dele pela pesquisa e envia interesse.',
      },
      {
        titulo: 'Como funciona o cadastro?',
        descricao: 'O cadastro é gratuito e leva menos de um minuto. Você escolhe se é Atleta ou Empresário / Olheiro — essa escolha define quais recursos você verá.',
        passos: ['Clique em "Criar conta" no topo da página.', 'Escolha o tipo de conta: Atleta ou Empresário / Olheiro.', 'Informe nome completo, e-mail e uma senha com pelo menos 6 caracteres.', 'Pronto! Você já entra logado e é levado ao seu perfil para completar os dados.'],
        exemplo: 'Maria é olheira de um clube: ela escolhe "Empresário / Olheiro". Já o filho dela, jogador, cria a própria conta escolhendo "Atleta".',
      },
      {
        titulo: 'Qual a diferença entre conta de atleta e de empresário?',
        descricao: 'Atletas montam o portfólio e respondem aos interesses recebidos. Empresários pesquisam atletas, enviam interesse e podem comprovar sua atuação profissional para receber o selo de verificado. A tabela no final desta página resume tudo.',
      },
    ],
  },
  {
    id: 'perfil', titulo: 'Perfil e foto', Icone: IconeUsuario,
    resumo: 'Como preencher e editar seus dados e sua foto.',
    topicos: [
      {
        titulo: 'Como criar e editar meu perfil?',
        descricao: 'Acesse "Meu perfil" no menu do seu avatar. Atletas informam idade, posição, pé dominante, clube atual, cidade, estado e biografia. Empresários informam empresa/clube, cargo, cidade, estado e biografia. Clique em "Salvar alterações" para guardar.',
        passos: ['Abra o menu do seu nome (canto superior direito) e clique em "Meu perfil".', 'Preencha ou altere os campos desejados.', 'Clique em "Salvar alterações" e aguarde a confirmação em verde.'],
        exemplo: 'Biografia de atleta: "Atacante veloz, joguei 2 anos na base do clube X e busco uma nova oportunidade."',
      },
      {
        titulo: 'Como adicionar, trocar ou remover minha foto?',
        descricao: 'No topo da página "Meu perfil" existe o bloco "Foto de perfil". Use "Alterar foto" para enviar uma imagem (JPG, PNG ou WEBP) e "Remover" para voltar às iniciais do seu nome. Sua foto aparece no perfil, nas pesquisas, nas conversas e no cabeçalho.',
        exemplo: 'Prefira uma foto nítida, de rosto, com boa iluminação. Imagens grandes são reduzidas automaticamente.',
      },
      {
        titulo: 'Posso excluir minha conta?',
        descricao: 'Sim. Em "Meu perfil", no final da página, existe a opção "Excluir minha conta". Ela apaga seus dados, portfólio, histórico, interesses, mensagens e documentos de forma permanente e não pode ser desfeita.',
      },
    ],
  },
  {
    id: 'atletas', titulo: 'Para atletas', Icone: IconeVideo,
    resumo: 'Monte seu portfólio com vídeos e histórico esportivo.',
    topicos: [
      {
        titulo: 'Como montar meu portfólio de vídeos?',
        descricao: 'O portfólio fica em "Meu feed". Você cola o link de um vídeo do YouTube e, se quiser, dá um título. Os empresários veem esses vídeos no seu perfil.',
        passos: ['Publique o vídeo no seu canal do YouTube (pode ser "não listado").', 'Abra "Meu feed" no menu.', 'Cole o link do vídeo e, opcionalmente, um título.', 'Clique em "Adicionar ao portfólio".'],
        exemplo: 'Título: "Gols do campeonato estadual sub-17 2026". Link: https://www.youtube.com/watch?v=...',
      },
      {
        titulo: 'Como adicionar informações esportivas (clubes e competições)?',
        descricao: 'Em "Meu perfil", logo abaixo dos seus dados, existem as seções "Clubes" e "Competições". Registre cada time pelo qual jogou (categoria, cidade, período) e cada competição disputada (ano, resultado). Isso aparece no seu perfil para os empresários.',
        exemplo: 'Clube: Grêmio Foot-Ball Porto Alegrense · Sub-15 · 2022 a 2023. Competição: Copa Gaúcha 2024 · Vice-campeão.',
      },
      {
        titulo: 'Como responder aos interesses que recebo?',
        descricao: 'Quando um empresário demonstra interesse em você, o pedido aparece em "Interesses". Você pode Aceitar ou Recusar. Ao aceitar, os dois dão match e a conversa é liberada.',
      },
    ],
  },
  {
    id: 'empresarios', titulo: 'Para empresários e olheiros', Icone: IconeBusca,
    resumo: 'Encontre atletas e demonstre interesse.',
    topicos: [
      {
        titulo: 'Como pesquisar atletas?',
        descricao: 'Clique em "Pesquisar" no menu. Combine os filtros para refinar os resultados: nome, posição, cidade, estado e faixa de idade. Clique em um atleta para ver o perfil completo, com vídeos e histórico.',
        passos: ['Abra "Pesquisar" no menu.', 'Preencha um ou mais filtros (todos são opcionais).', 'Clique em "Pesquisar" — use "Limpar" para recomeçar.', 'Abra o perfil do atleta que interessar.'],
        exemplo: 'Filtros: posição "Atacante", estado "RS", idade de 15 a 17 anos.',
      },
      {
        titulo: 'Como enviar interesse a um atleta?',
        descricao: 'No perfil do atleta, clique em "Enviar interesse". O atleta recebe o pedido e decide se aceita. Você acompanha o status (pendente, aceito ou recusado) no próprio perfil dele e na página "Interesses".',
      },
    ],
  },
  {
    id: 'match', titulo: 'Interesses, Match e Mensagens', Icone: IconeEstrela,
    resumo: 'Como o contato entre atleta e empresário acontece.',
    topicos: [
      {
        titulo: 'Como funcionam os interesses e o Match?',
        descricao: 'O contato segue sempre a mesma ordem: o empresário envia interesse → o atleta aceita ou recusa → se aceitar, forma-se um Match. Assim o atleta só conversa com quem ele escolheu.',
        exemplo: 'Carlos (olheiro) envia interesse ao João. João aceita. Os dois agora têm um Match e aparecem na aba "Matches".',
      },
      {
        titulo: 'Como usar as mensagens?',
        descricao: 'As mensagens ficam em "Matches" no menu. Cada match aparece na lista à esquerda; clique para abrir a conversa e escreva na caixa inferior (até 1000 caracteres por mensagem). Você também chega à conversa pelo botão de chat em "Interesses".',
        passos: ['Abra "Matches" no menu.', 'Escolha a conversa na lista.', 'Digite a mensagem e clique em "Enviar".'],
      },
      {
        titulo: 'Por que não consigo enviar mensagem a alguém?',
        descricao: 'As mensagens só são liberadas depois de um match. Se o interesse ainda está pendente ou foi recusado, a conversa não fica disponível.',
      },
    ],
  },
  {
    id: 'verificacao', titulo: 'Verificação profissional', Icone: IconeEscudo,
    resumo: 'Como empresários ganham o selo de verificado.',
    topicos: [
      {
        titulo: 'O que é a Comprovação Profissional?',
        descricao: 'É um documento (PDF ou imagem) que comprova seu vínculo com um clube ou sua atuação como empresário. Depois de analisado pela nossa equipe e aprovado, seu perfil recebe o selo "Verificado", que passa mais confiança aos atletas.',
        exemplo: 'Exemplos de documentos: contrato ou declaração do clube, credencial de agente/empresário, registro profissional.',
      },
      {
        titulo: 'Como enviar meu documento?',
        descricao: 'Disponível para contas de empresário, na página "Meu perfil", seção "Comprovação Profissional".',
        passos: ['Abra "Meu perfil".', 'Na seção "Comprovação Profissional", clique em "Enviar documento".', 'Escolha um PDF, JPG, PNG ou WEBP de até 5 MB.', 'Acompanhe o status: Pendente, Aprovado ou Recusado.'],
      },
      {
        titulo: 'Enviar o documento já me verifica?',
        descricao: 'Não. O envio apenas coloca o documento na fila: ele fica "Pendente" até um administrador analisar. Se for recusado, você verá o motivo e poderá enviar outro documento. Substituir o documento reinicia a análise.',
      },
      {
        titulo: 'Meu documento fica público?',
        descricao: 'Não. O documento é privado: somente você e a equipe de análise conseguem abri-lo. Outros usuários veem apenas o selo de verificado, nunca o arquivo.',
      },
    ],
  },
];

const TABELA = [
  ['Criar e editar perfil', true, true],
  ['Foto de perfil', true, true],
  ['Portfólio de vídeos ("Meu feed")', true, false],
  ['Histórico de clubes e competições', true, false],
  ['Pesquisar atletas com filtros', false, true],
  ['Enviar interesse', false, true],
  ['Aceitar ou recusar interesses', true, false],
  ['Matches e mensagens', true, true],
  ['Comprovação Profissional e selo', false, true],
];

const normalizar = (texto) => texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function CentralAjuda() {
  const { usuario } = useAutenticacao();
  const local = useLocation();
  const [busca, setBusca] = useState('');
  const [ativa, setAtiva] = useState('todas');

  // Links do rodapé (ex.: /ajuda#atletas) rolam até a categoria correspondente.
  useEffect(() => {
    if (!local.hash) return;
    const alvo = document.getElementById(local.hash.slice(1));
    if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [local.hash]);

  const categoriasVisiveis = useMemo(() => {
    const termo = normalizar(busca.trim());
    return CATEGORIAS
      .filter((categoria) => ativa === 'todas' || categoria.id === ativa)
      .map((categoria) => ({
        ...categoria,
        topicos: categoria.topicos.filter((topico) => {
          if (!termo) return true;
          const texto = [topico.titulo, topico.descricao, topico.exemplo, ...(topico.passos || [])].join(' ');
          return normalizar(texto).includes(termo);
        }),
      }))
      .filter((categoria) => categoria.topicos.length > 0);
  }, [busca, ativa]);

  return (
    <main className="pagina ajuda">
      <div className="container">
        <header className="ajuda-hero">
          <span className="ajuda-hero-icone"><IconeAjuda tamanho={26} /></span>
          <p className="eyebrow-auth">Central de Ajuda</p>
          <h1>Como podemos ajudar?</h1>
          <p>Guias simples para você aproveitar o FutLink do cadastro ao match.</p>
          <label className="ajuda-busca">
            <IconeBusca tamanho={18} />
            <span className="so-leitor">Buscar na Central de Ajuda</span>
            <input type="search" placeholder="Busque por um assunto (ex.: foto, vídeo, match, verificação)" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </label>
        </header>

        <div className="ajuda-categorias" role="tablist" aria-label="Categorias">
          <button type="button" className={`ajuda-aba ${ativa === 'todas' ? 'ativa' : ''}`} onClick={() => setAtiva('todas')}>Todas</button>
          {CATEGORIAS.map(({ id, titulo, Icone }) => (
            <button key={id} type="button" className={`ajuda-aba ${ativa === id ? 'ativa' : ''}`} onClick={() => setAtiva(id)}><Icone tamanho={16} /> {titulo}</button>
          ))}
        </div>

        {categoriasVisiveis.length === 0 ? (
          <div className="cartao estado-centro">
            <h3>Nenhum resultado para "{busca}"</h3>
            <p>Tente outra palavra, como "perfil", "vídeo" ou "mensagem".</p>
            <div className="estado-acoes"><button type="button" className="botao botao-secundario" onClick={() => { setBusca(''); setAtiva('todas'); }}>Limpar busca</button></div>
          </div>
        ) : (
          categoriasVisiveis.map(({ id, titulo, resumo, Icone, topicos }) => (
            <section key={id} id={id} className="ajuda-categoria">
              <div className="ajuda-categoria-topo">
                <span className="ajuda-categoria-icone"><Icone tamanho={22} /></span>
                <div>
                  <h2>{titulo}</h2>
                  <p>{resumo}</p>
                </div>
              </div>
              <div className="ajuda-topicos">
                {topicos.map((topico) => (
                  <details key={topico.titulo} className="cartao ajuda-topico" open={Boolean(busca.trim())}>
                    <summary>{topico.titulo}</summary>
                    <div className="ajuda-topico-corpo">
                      <p>{topico.descricao}</p>
                      {topico.passos && (<ol className="ajuda-passos">{topico.passos.map((passo) => (<li key={passo}>{passo}</li>))}</ol>)}
                      {topico.exemplo && (<div className="ajuda-exemplo"><strong>Exemplo</strong><span>{topico.exemplo}</span></div>)}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))
        )}

        {/* Tabela por tipo de usuário (aparece quando não há busca) */}
        {!busca.trim() && ativa === 'todas' && (
          <section id="funcionalidades" className="ajuda-categoria">
            <div className="ajuda-categoria-topo">
              <span className="ajuda-categoria-icone"><IconeCheck tamanho={22} /></span>
              <div>
                <h2>Funcionalidades por tipo de conta</h2>
                <p>O que cada tipo de usuário pode fazer no FutLink.</p>
              </div>
            </div>
            <div className="cartao ajuda-tabela-caixa">
              <table className="ajuda-tabela">
                <thead><tr><th>Funcionalidade</th><th>Atleta</th><th>Empresário</th></tr></thead>
                <tbody>
                  {TABELA.map(([nome, atleta, empresario]) => (
                    <tr key={nome}>
                      <td>{nome}</td>
                      <td>{atleta ? <span className="sim" aria-label="Disponível"><IconeCheck tamanho={18} /></span> : <span className="nao" aria-label="Indisponível">—</span>}</td>
                      <td>{empresario ? <span className="sim" aria-label="Disponível"><IconeCheck tamanho={18} /></span> : <span className="nao" aria-label="Indisponível">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section id="contato" className="cartao ajuda-contato">
          <span className="ajuda-categoria-icone"><IconeChat tamanho={22} /></span>
          <div>
            <h3>Ainda precisa de ajuda?</h3>
            <p>Não encontrou o que procurava? Veja as informações de contato no rodapé desta página.</p>
          </div>
          {!usuario && <Link to="/cadastro" className="botao botao-primario">Criar minha conta</Link>}
        </section>
      </div>

      <style>{`
        .ajuda-hero { text-align: center; max-width: 720px; margin: 0 auto 36px; }
        .ajuda-hero .eyebrow-auth { justify-content: center; }
        .ajuda-hero h1 { font-size: 2.6rem; margin-bottom: 12px; }
        .ajuda-hero-icone { width: 56px; height: 56px; border-radius: 16px; display: inline-grid; place-items: center; margin-bottom: 16px; color: #06100a; background: linear-gradient(135deg, var(--verde-neon), var(--verde-grama)); box-shadow: 0 8px 24px rgba(63, 145, 66, 0.4); }
        .ajuda-busca { display: flex; align-items: center; gap: 12px; padding: 0 18px; border-radius: 14px; background: var(--preto-cartao); border: 1px solid var(--borda-forte); color: var(--cinza-aco); transition: border-color .15s, box-shadow .15s; }
        .ajuda-busca:focus-within { border-color: var(--verde-grama); box-shadow: 0 0 0 3px rgba(63, 145, 66, 0.25); }
        .ajuda-busca input { flex: 1; background: none; border: none; outline: none; color: var(--branco-gelo); font-family: var(--fonte-corpo); font-size: 1rem; padding: 16px 0; min-width: 0; }
        .ajuda-categorias { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 44px; }
        .ajuda-aba { display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 999px; border: 1px solid var(--borda-sutil); background: transparent; color: var(--cinza-aco); font-family: var(--fonte-corpo); font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all .15s; }
        .ajuda-aba:hover { color: var(--branco-gelo); border-color: var(--borda-forte); }
        .ajuda-aba.ativa { color: var(--verde-neon); border-color: var(--verde-grama); background: rgba(63, 145, 66, 0.14); }
        .ajuda-categoria { margin-bottom: 44px; scroll-margin-top: 96px; max-width: 860px; margin-left: auto; margin-right: auto; }
        .ajuda-categoria-topo { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
        .ajuda-categoria-topo h2 { font-size: 1.5rem; margin: 0 0 2px; }
        .ajuda-categoria-topo p { margin: 0; font-size: 0.92rem; }
        .ajuda-categoria-icone { flex-shrink: 0; width: 48px; height: 48px; border-radius: 13px; display: grid; place-items: center; color: var(--verde-neon); background: rgba(63, 145, 66, 0.14); border: 1px solid rgba(63, 145, 66, 0.35); }
        .ajuda-topicos { display: flex; flex-direction: column; gap: 10px; }
        .ajuda-topico { padding: 0; overflow: hidden; transition: border-color .15s; }
        .ajuda-topico[open] { border-color: var(--borda-forte); }
        .ajuda-topico summary { list-style: none; cursor: pointer; padding: 18px 22px; font-weight: 600; color: var(--branco-gelo); display: flex; justify-content: space-between; align-items: center; gap: 16px; }
        .ajuda-topico summary::-webkit-details-marker { display: none; }
        .ajuda-topico summary::after { content: '+'; font-size: 1.4rem; color: var(--verde-grama); line-height: 1; transition: transform .2s; }
        .ajuda-topico[open] summary::after { transform: rotate(45deg); }
        .ajuda-topico summary:hover { color: var(--verde-luz); }
        .ajuda-topico-corpo { padding: 0 22px 22px; }
        .ajuda-topico-corpo > p { font-size: 0.95rem; }
        .ajuda-passos { margin: 0 0 16px; padding: 0; list-style: none; counter-reset: passo; display: flex; flex-direction: column; gap: 10px; }
        .ajuda-passos li { counter-increment: passo; display: flex; gap: 12px; align-items: flex-start; color: var(--branco-gelo); font-size: 0.93rem; }
        .ajuda-passos li::before { content: counter(passo); flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-family: var(--fonte-dados); font-size: 0.75rem; font-weight: 600; color: #06100a; background: var(--verde-grama); }
        .ajuda-exemplo { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; border-radius: 10px; border-left: 3px solid var(--ouro); background: rgba(233, 196, 106, 0.07); font-size: 0.9rem; }
        .ajuda-exemplo strong { color: var(--ouro); font-size: 0.75rem; text-transform: uppercase; letter-spacing: .06em; }
        .ajuda-exemplo span { color: var(--cinza-aco); }
        .ajuda-tabela-caixa { padding: 8px 8px; overflow-x: auto; }
        .ajuda-tabela { width: 100%; border-collapse: collapse; font-size: 0.92rem; min-width: 440px; }
        .ajuda-tabela th, .ajuda-tabela td { padding: 13px 16px; text-align: center; border-bottom: 1px solid var(--borda-sutil); }
        .ajuda-tabela th:first-child, .ajuda-tabela td:first-child { text-align: left; }
        .ajuda-tabela th { font-family: var(--fonte-dados); font-size: 0.75rem; text-transform: uppercase; letter-spacing: .06em; color: var(--verde-luz); }
        .ajuda-tabela tbody tr:last-child td { border-bottom: none; }
        .ajuda-tabela .sim { color: var(--verde-neon); display: inline-flex; }
        .ajuda-tabela .nao { color: #4b574f; }
        .ajuda-contato { max-width: 860px; margin: 0 auto; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .ajuda-contato > div { flex: 1; min-width: 220px; }
        .ajuda-contato h3 { font-family: var(--fonte-corpo); font-weight: 700; margin: 0 0 4px; font-size: 1.1rem; }
        .ajuda-contato p { margin: 0; font-size: 0.92rem; }
        @media (max-width: 600px) { .ajuda-hero h1 { font-size: 1.9rem; } .ajuda-topico summary { padding: 16px; } .ajuda-topico-corpo { padding: 0 16px 18px; } .ajuda-categoria-topo h2 { font-size: 1.25rem; } }
      `}</style>
    </main>
  );
}
