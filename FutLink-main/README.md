# FutLink — Backend

Sistema web que conecta jogadores de futebol de base a empresários, olheiros e equipes em busca de novos talentos. O FutLink funciona como ponte entre atletas promissores e oportunidades profissionais, através de perfis completos e portfólio digital.

Este repositório contém a API (back-end) do projeto.

## Tecnologias

- Node.js + Express
- MySQL, via Sequelize (ORM)
- JWT para autenticação
- bcrypt para criptografia de senha

## Funcionalidades

- Cadastro e login de usuários, com diferenciação entre Atleta e Empresário
- Criação e edição de perfil, separado por tipo de usuário
- Pesquisa de atletas com filtros por nome, posição, cidade, estado e idade
- Visualização de perfil completo (atleta ou empresário)
- Portfólio de vídeos do YouTube (adicionar, editar, excluir, listar)
- Sistema de interesses: empresário envia, atleta aceita ou recusa
- Matches: criados automaticamente quando um interesse é aceito
- Mensagens entre atleta e empresário, liberadas somente após um match

## Estrutura do banco de dados

- **Usuarios** — dados de login (nome, e-mail, senha, tipo)
- **PerfilAtletas** — dados específicos do atleta, ligada a um usuário
- **PerfilEmpresarios** — dados específicos do empresário, ligada a um usuário
- **Portfolios** — vídeos do YouTube de cada atleta
- **Interesses** — solicitações do empresário para o atleta (pendente/aceito/recusado)
- **Matches** — criada quando um interesse é aceito
- **Mensagens** — conversas entre pares que já deram match

## Estrutura de pastas

```
backend/
├── configuracao/    → conexão com o banco
├── modelos/         → tabelas e relacionamentos (Sequelize)
├── controladores/   → regras de negócio
├── rotas/           → endpoints da API
├── seguranca/       → autenticação (middleware JWT)
└── servidor.js      → ponto de entrada da aplicação
```

## Time

Projeto de TCC — Matheus, Arthur e Kauahn.


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