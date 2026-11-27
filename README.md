# Gestio

Sistema web de gestão gratuito e universal para pequenos negócios: produtos e serviços, clientes, vendas com controle de estoque, contas a pagar e a receber e usuários, tudo em um só lugar.

Trabalho final da disciplina **Desenvolvimento Web** (Prof. Francisco Estevão Simão Pereira) · Ciência da Computação · UNIFOR · 2026.2

**Acesse:** https://gestio-delta.vercel.app

| Login de teste | Senha | Perfil |
|---|---|---|
| admin@gestio.com | 123456 | administrador da Empresa Demo |
| funcionario@gestio.com | 123456 | funcionário da Empresa Demo |
| salao@gestio.com | 123456 | administrador do Salão Bela Vista |

## Equipe

| Nome | Papel |
|---|---|
| Levi Costa Queiroz | Back-end, banco de dados, integração e deploy |
| Leonardo Noroes Milfont Padilha | Front-end (telas de produtos e vendas) |
| Marcelo Fong | Testes |

## O que o sistema faz

- **Login e cadastro de empresa**, com dois perfis: administrador e funcionário.
- **Painel** com vendas do mês, produtos com estoque baixo, últimas vendas e resumo financeiro.
- **Produtos e serviços**: cadastro, busca, edição e exclusão (produto já vendido não pode ser excluído).
- **Clientes**: cadastro, busca, edição e exclusão.
- **Vendas**: venda com vários itens, total calculado no servidor e baixa automática de estoque; cancelar devolve o estoque.
- **Financeiro** (só administrador): contas a pagar e a receber, filtros e marcar como pago.
- **Usuários** (só administrador): cadastrar funcionários e ativar/desativar acesso.
- **Multiempresa**: cada empresa vê apenas os próprios dados.

## Tecnologias

- **Front-end:** React 18 (Vite), Bootstrap 5, Bootstrap Icons, React Router, Axios
- **Back-end:** Node.js, Express, mysql2, bcryptjs, jsonwebtoken (JWT)
- **Banco de dados:** MySQL 8 (local) e TiDB Cloud, compatível com MySQL (produção)
- **Hospedagem:** Vercel (front-end e API)
- **Organização:** GitHub + Trello

## Estrutura

```
gestio/
├── frontend/            React + Vite + Bootstrap
│   └── src/
│       ├── pages/          telas (login, painel, clientes, produtos, vendas, financeiro, usuários)
│       ├── components/     layout, menu e rota protegida
│       └── services/       Axios (api.js) e sessão do login (auth.js)
├── backend/             API REST em Express
│   ├── scripts/         criar-banco.js (cria o banco na nuvem)
│   └── src/
│       ├── routes/         URLs da API
│       ├── middlewares/    login (JWT), permissão de admin e erros
│       ├── controllers/    recebem a requisição e devolvem a resposta
│       ├── services/       regras de negócio e validações
│       ├── models/         consultas SQL
│       └── config/         conexão com o banco e configuração do login
└── database/
    └── script.sql       criação das 7 tabelas + dados de exemplo
```

## Como rodar no seu computador

Pré-requisitos: **Node.js 20+** e **MySQL 8**.

### 1. Banco de dados

Abra o `database/script.sql` no MySQL Workbench e execute tudo (raio ⚡). Ou pelo terminal:

```bash
mysql -u root -p < database/script.sql
```

### 2. API

```bash
cd backend
npm install
copy .env.example .env      # Linux/Mac: cp .env.example .env
```

No `.env`, coloque a senha do seu MySQL em `DB_PASSWORD` e uma frase qualquer em `JWT_SECRET`. Depois:

```bash
npm run dev
```

Teste em http://localhost:3000/health, deve aparecer `{"status":"ok"}`.

### 3. Front-end

Em outro terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Abra http://localhost:5173 e entre com um dos logins de teste.

## Deploy (Vercel + TiDB)

São dois projetos na Vercel, os dois ligados a este repositório:

| Projeto | Root Directory | Variáveis de ambiente |
|---|---|---|
| API | `backend` | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME=gestio`, `DB_SSL=true`, `DB_POOL=3`, `JWT_SECRET` |
| Site | `frontend` | `VITE_API_URL=https://<link-da-api>.vercel.app/api` |

O banco de produção é criado uma vez com `node --env-file=.env.nuvem scripts/criar-banco.js` (veja `backend/.env.nuvem.example`).

## Rotas da API

Todas, menos `/auth/login` e `/auth/registrar`, exigem o cabeçalho `Authorization: Bearer <token>`.

| Método | Rota | O que faz |
|---|---|---|
| GET | `/health` | Verifica se a API está no ar |
| POST | `/api/auth/login` | Entra e devolve o token |
| POST | `/api/auth/registrar` | Cadastra empresa e administrador |
| GET | `/api/auth/eu` | Dados do usuário logado |
| GET | `/api/painel` | Resumo do painel |
| GET, POST | `/api/clientes` | Lista (com `?busca=`) e cria |
| GET, PUT, DELETE | `/api/clientes/:id` | Busca, atualiza e exclui |
| GET, POST | `/api/produtos` | Lista e cria |
| GET, PUT, DELETE | `/api/produtos/:id` | Busca, atualiza e exclui |
| GET, POST | `/api/vendas` | Lista e registra venda |
| GET, DELETE | `/api/vendas/:id` | Detalhe e cancelamento (devolve o estoque) |
| GET, POST | `/api/lancamentos` | Lista e cria (admin) |
| GET, PUT, DELETE | `/api/lancamentos/:id` | Busca, atualiza e exclui (admin) |
| PATCH | `/api/lancamentos/:id/pagar` | Marca como pago (admin) |
| GET, POST | `/api/usuarios` | Lista e cria funcionário (admin) |
| PATCH | `/api/usuarios/:id/ativo` | Ativa ou desativa (admin) |

## Como trabalhamos

1. `git checkout main && git pull`
2. `git checkout -b feature/nome-da-tarefa`
3. Commits com prefixo: `feat:`, `fix:`, `docs:`, `style:`
4. `git push -u origin feature/nome-da-tarefa`
5. Pull Request → revisão → merge
6. Mover o cartão no Trello

**Nunca** fazer commit dos arquivos `.env` e `.env.nuvem`.
