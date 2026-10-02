# FutLink — Frontend

Interface web do FutLink, sistema que conecta jogadores de futebol de base a empresários e olheiros através de portfólio digital e perfis completos.

Este repositório contém a interface (front-end) do projeto, que consome a API do backend.

## Tecnologias

- React
- React Router
- Axios
- Vite

## Telas

- **Início** — apresentação do produto
- **Cadastro** — criação de conta, com seleção do tipo de usuário (Atleta ou Empresário)
- **Login**
- **Perfil** — visualização e edição, adaptada ao tipo de usuário logado
- **Feed** — portfólio de vídeos do YouTube do atleta
- **Pesquisa** — busca de atletas com filtros por nome, posição e cidade
- **Visualização de perfil** — perfil completo de um atleta, com botão de enviar interesse
- **Interesses** — atleta aceita/recusa solicitações; empresário acompanha status
- **Mensagens** — chat entre atleta e empresário, liberado após o match

## Identidade visual

Tema inspirado em campo de futebol à noite, sob os holofotes: preto "estádio" (não preto puro), verde grama, linhas de campo sutis no fundo e tipografia com números estilo placar.

## Estrutura de pastas

```
frontend/
├── src/
│   ├── componentes/   → elementos reutilizáveis (navbar, cards, rota protegida)
│   ├── contexto/       → autenticação (usuário logado)
│   ├── paginas/          → telas do sistema
│   ├── servicos/          → comunicação com o backend
│   ├── estilos/            → tema (cores, fontes)
│   ├── App.jsx              → rotas da aplicação
│   └── main.jsx              → ponto de entrada
└── index.html
```

## Time

Projeto de TCC — Matheus, Arthur e Kauahn.
