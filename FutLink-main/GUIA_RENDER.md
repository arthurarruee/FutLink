# Guia de publicação no Render (FutLink)

## Backend (Web Service – Node)
- Root Directory: `backend` · Build Command: `npm install` · Start Command: `npm start`
- Environment (variáveis):
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
  - `JWT_SECRET` (obrigatório, texto longo e aleatório)
  - `FRONTEND_URL` (recomendado): endereço do front, ex.: `https://futlink-front.onrender.com`
  - `ADMIN_EMAILS` (para o painel de verificação): e-mail(s) do(s) administrador(es), separados por vírgula
- Teste: abra `https://SEU-BACKEND.onrender.com/saude` → deve mostrar `{"status":"ok"}`.
- Plano gratuito: após ~15 min parado o serviço "dorme"; a 1ª requisição pode levar 30–60 s.
- O MySQL (Hostinger) precisa aceitar conexões remotas do Render ("Remote MySQL").

## Frontend (Static Site)
- Root Directory: `frontend` · Build Command: `npm install && npm run build` · Publish Directory: `dist`
- Environment: `VITE_API_URL=https://SEU-BACKEND.onrender.com/api` (obrigatório)
- Opcional: `VITE_CONTATO_EMAIL=seu-email@exemplo.com` (aparece no rodapé)
- Variáveis `VITE_` entram no build: depois de mudar, faça um novo deploy do front.
- **Redirects/Rewrites** (aba do Static Site): Source `/*` → Destination `/index.html` → Action **Rewrite**.
  Sem isso, abrir/atualizar (F5) uma página como `/atleta/12` ou `/ajuda` dá "Not Found".

## Novidades da versão 2 (foto, Central de Ajuda, verificação)

### Banco de dados
- Ao iniciar, o backend cria automaticamente 2 tabelas NOVAS: `Arquivos` (fotos e documentos) e `Verificacoes`.
  Nenhuma tabela existente é alterada e nenhum dado é apagado (o `sync()` só cria o que não existe).
- Fotos e documentos ficam no MySQL (e não em pasta do servidor) porque o disco do Render gratuito é apagado a cada deploy.
- Limites: foto até 2 MB (o site reduz a imagem sozinho antes de enviar), documento até 5 MB.
  Se o seu MySQL tiver `max_allowed_packet` muito baixo (< 8 MB), envios maiores podem falhar; a Hostinger costuma usar valores maiores.

### Como criar o administrador (faça nesta ordem)
1. Crie uma conta normalmente pelo site (ex.: com o e-mail que será o do administrador).
2. No Render → FutLink-back → **Environment**, crie `ADMIN_EMAILS` com esse e-mail e salve (o serviço reinicia).
3. No site, saia e entre de novo com essa conta: aparece o item **Admin** no menu.
> Importante: só coloque o e-mail em `ADMIN_EMAILS` DEPOIS de a conta existir. Assim ninguém consegue se cadastrar com
> o e-mail do administrador antes de você. Use uma senha forte nessa conta.
> Dica: use uma conta exclusiva para administrar, e não a sua conta de atleta/empresário.

### Privacidade dos arquivos
- Foto: só usuários logados conseguem ver. Documento de comprovação: só o dono e o administrador.
- Os arquivos nunca ficam em endereço público; só saem pela API, depois de checar o token de login.
