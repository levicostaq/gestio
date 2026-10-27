# Gestio

Sistema web de gestão universal para pequenas empresas: clientes, produtos e estoque, vendas e financeiro em um só lugar.

Trabalho final da disciplina **Desenvolvimento Web** · UNIFOR · 2026.2

## Equipe

| Nome | Papel |
|---|---|
| [Nome] | Gerente de Projeto + Back-end |
| [Nome] | Front-end |
| [Nome] | Front-end / Design + Back-end |

## Tecnologias

- **Front-end:** React (Vite), Bootstrap, React Router, Axios
- **Back-end:** Node.js, Express, mysql2
- **Banco de dados:** MySQL
- **Organização:** GitHub + Trello

## Estrutura

```
gestio/
├── frontend/          React + Vite + Bootstrap
├── backend/           API REST em Express
│   └── src/
│       ├── routes/        URLs da API
│       ├── controllers/   recebem a requisição e devolvem a resposta
│       ├── services/      regras de negócio e validações
│       ├── models/        consultas SQL
│       ├── middlewares/   tratamento de erros (e, depois, autenticação)
│       └── config/        conexão com o banco
├── database/
│   └── script.sql     criação das 7 tabelas + dados de exemplo
└── docs/
    └── evidencias/    prints para o Dreamshaper e o relatório
```

## Como rodar

Pré-requisitos: **Node.js 18+** e **MySQL 8**.

### 1. Banco de dados

Abra o `database/script.sql` no MySQL Workbench e execute tudo (raio ⚡).
Ou pelo terminal:

```bash
mysql -u root -p < database/script.sql
```

### 2. API

```bash
cd backend
npm install
cp .env.example .env     # no Windows: copy .env.example .env
```

Abra o `.env` e coloque a senha do seu MySQL em `DB_PASSWORD`. Depois:

```bash
npm run dev
```

Teste em http://localhost:3000/health → deve aparecer `{"status":"ok"}`.

### 3. Front-end

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abra http://localhost:5173

## Rotas da API

| Método | Rota | O que faz |
|---|---|---|
| GET | `/health` | Verifica se a API está no ar |
| GET | `/api/clientes?busca=` | Lista clientes (com busca opcional) |
| GET | `/api/clientes/:id` | Busca um cliente |
| POST | `/api/clientes` | Cria cliente |
| PUT | `/api/clientes/:id` | Atualiza cliente |
| DELETE | `/api/clientes/:id` | Exclui cliente |

## Como criar um módulo novo (ex.: produtos)

O módulo de **clientes** está completo e serve de modelo. Para produtos:

1. `backend/src/models/produtos.model.js` (copiar de clientes e trocar o SQL)
2. `backend/src/services/produtos.service.js` (validações: preço ≥ 0, estoque ≥ 0)
3. `backend/src/controllers/produtos.controller.js`
4. `backend/src/routes/produtos.routes.js` e registrar em `routes/index.js`
5. `frontend/src/pages/produtos/ProdutosLista.jsx` e `ProdutoForm.jsx`
6. Trocar a rota de `EmConstrucao` em `frontend/src/App.jsx`

## Como trabalhamos

1. `git checkout main && git pull`
2. `git checkout -b feature/nome-da-tarefa`
3. Commits com prefixo: `feat:`, `fix:`, `docs:`, `style:`
4. `git push -u origin feature/nome-da-tarefa`
5. Abrir Pull Request → outra pessoa revisa → merge
6. Mover o cartão no Trello

**Nunca** fazer commit do arquivo `.env`.
