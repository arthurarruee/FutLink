# Guia de publicação no Render (FutLink)

## Backend (Web Service – Node)
- Root Directory: `backend` · Build Command: `npm install` · Start Command: `npm start`
- Environment: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` (obrigatório), `FRONTEND_URL` (opcional, recomendado)
- Teste: abra `https://SEU-BACKEND.onrender.com/saude` → deve mostrar `{"status":"ok"}`.
- Plano gratuito: após ~15 min parado o serviço "dorme"; a 1ª requisição pode levar 30–60 s.
- O MySQL (Hostinger) precisa aceitar conexões remotas do Render ("Remote MySQL").

## Frontend (Static Site)
- Root Directory: `frontend` · Build Command: `npm install && npm run build` · Publish Directory: `dist`
- Environment: `VITE_API_URL=https://SEU-BACKEND.onrender.com/api` (precisa de novo deploy ao mudar)
- **Redirects/Rewrites** (aba do Static Site): Source `/*` → Destination `/index.html` → Action **Rewrite**.
  Sem isso, abrir/atualizar (F5) uma página como `/atleta/12` dá "Not Found".
