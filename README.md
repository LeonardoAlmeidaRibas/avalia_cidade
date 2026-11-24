# AvaliaCidades

Aplicação web acadêmica desenvolvida com React para pesquisar municípios brasileiros e compartilhar avaliações sobre diferentes aspectos da experiência de viver ou visitar uma cidade. As avaliações são salvas por uma API própria (Node.js + Express + PostgreSQL) e só podem ser publicadas por usuários autenticados.

## Funcionalidades

- Consulta dos municípios brasileiros pela API de Localidades do IBGE.
- Pesquisa de municípios por nome ou sigla do estado.
- Cadastro de conta e login com nickname e senha.
- Seleção de uma cidade para consultar suas avaliações.
- Cadastro de avaliações (somente logado) com comentário e notas de 1 a 5 para seis critérios: segurança, transporte, saúde, educação, lazer e infraestrutura.
- Cálculo da nota geral de cada avaliação e da média da cidade.
- Exibição da média por critério, quantidade de avaliações e comentários publicados.
- Estados de carregamento, mensagens de erro e confirmação de cadastro.
- Interface responsiva para desktop e dispositivos móveis.

## Tecnologias

**Front-end:** React 19, JavaScript, HTML5, CSS3 e Vite.

**Back-end (`server/`):** Node.js, Express 5, PostgreSQL (`pg`), JWT (`jsonwebtoken`), `bcrypt` para hash de senhas, `cors` e `dotenv`.

**APIs externas:** API de Localidades do IBGE.

## Visão geral da arquitetura

```
React (Vite, :5173)  ──►  API AvaliaCidades (Express, :3001)  ──►  PostgreSQL
        │
        └──────────────►  API de Localidades do IBGE
```

## Documentação da API

URL base local: `http://localhost:3001`

Todas as requisições e respostas usam JSON. Erros retornam um objeto no formato `{ "message": "..." }`.

### Autenticação

Rotas protegidas exigem o cabeçalho:

```
Authorization: Bearer <token>
```

O token é um JWT retornado pelo cadastro e pelo login, com validade de 1 dia. Ele carrega o `id` e o `nickname` do usuário.

### Resumo dos endpoints

| Método | Endpoint              | Autenticação | Descrição                                   |
|--------|-----------------------|--------------|---------------------------------------------|
| GET    | `/`                   | Não          | Verifica se a API está no ar.               |
| GET    | `/api/health`         | Não          | Verifica a conexão com o PostgreSQL.        |
| POST   | `/api/auth/cadastro`  | Não          | Cria uma conta e retorna um token.          |
| POST   | `/api/auth/login`     | Não          | Autentica e retorna um token.               |
| GET    | `/api/avaliacoes`     | Não          | Lista avaliações (todas ou por cidade).     |
| POST   | `/api/avaliacoes`     | **Sim**      | Publica uma avaliação.                      |

---

### `POST /api/auth/cadastro`

Cria uma conta.

**Corpo da requisição**

```json
{
  "nickname": "joao",
  "senha": "minhasenha"
}
```

**Regras:** `nickname` com 3 a 30 caracteres e único; `senha` com no mínimo 6 caracteres. A senha é armazenada somente como hash (bcrypt).

**Resposta `201 Created`**

```json
{
  "message": "Conta criada com sucesso!",
  "usuario": { "id": 1, "nickname": "joao" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros:** `400` (nickname ou senha fora das regras), `409` (nickname já em uso), `500` (erro interno).

---

### `POST /api/auth/login`

**Corpo da requisição**

```json
{
  "nickname": "joao",
  "senha": "minhasenha"
}
```

O nickname não diferencia maiúsculas de minúsculas.

**Resposta `200 OK`**

```json
{
  "message": "Login realizado com sucesso!",
  "usuario": { "id": 1, "nickname": "joao" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros:** `401` (nickname ou senha incorretos), `500` (erro interno).

---

### `GET /api/avaliacoes`

Lista as avaliações, da mais recente para a mais antiga.

**Parâmetro opcional (query string)**

| Parâmetro  | Tipo    | Descrição                                                        |
|------------|---------|------------------------------------------------------------------|
| `cidadeId` | inteiro | Código IBGE do município. Se omitido, retorna todas as avaliações. |

**Exemplos**

```
GET /api/avaliacoes
GET /api/avaliacoes?cidadeId=4119905
```

**Resposta `200 OK`**

```json
[
  {
    "id": 1,
    "cidadeId": 4119905,
    "cidade": "Ponta Grossa",
    "estado": "PR",
    "autor": "joao",
    "notas": {
      "seguranca": 4,
      "transporte": 3,
      "saude": 4,
      "educacao": 4,
      "lazer": 5,
      "infraestrutura": 4
    },
    "nota": 4,
    "comentario": "Cidade agradável, mas o transporte público pode melhorar.",
    "data": "2026-11-20T12:00:00.000Z"
  }
]
```

O campo `autor` vem do nickname do usuário que publicou. O campo `nota` é a média dos seis critérios.

**Erros:** `400` (`cidadeId` inválido), `500` (erro interno).

---

### `POST /api/avaliacoes` 🔒

Publica uma avaliação em nome do usuário autenticado. O autor é definido pelo token, não pelo corpo da requisição.

**Cabeçalhos**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**Corpo da requisição**

```json
{
  "cidadeId": 4119905,
  "cidade": "Ponta Grossa",
  "estado": "PR",
  "comentario": "Cidade agradável, mas o transporte público pode melhorar.",
  "notas": {
    "seguranca": 4,
    "transporte": 3,
    "saude": 4,
    "educacao": 4,
    "lazer": 5,
    "infraestrutura": 4
  }
}
```

**Regras de validação**

- `cidadeId`: inteiro positivo.
- `cidade`: obrigatório; `estado`: sigla de 2 letras.
- `comentario`: obrigatório, até 2000 caracteres.
- `notas`: os seis critérios são obrigatórios, cada um com inteiro de 1 a 5.
- `nota` (geral) é calculada pelo servidor: média dos seis critérios com uma casa decimal.

**Resposta `201 Created`**

```json
{
  "id": 2,
  "cidadeId": 4119905,
  "cidade": "Ponta Grossa",
  "estado": "PR",
  "notas": { "seguranca": 4, "transporte": 3, "saude": 4, "educacao": 4, "lazer": 5, "infraestrutura": 4 },
  "nota": 4,
  "comentario": "Cidade agradável, mas o transporte público pode melhorar.",
  "data": "2026-11-24T15:30:00.000Z",
  "autor": "joao"
}
```

**Erros:** `400` (dados inválidos), `401` (sem token, token inválido ou expirado), `500` (erro interno).

---

### `GET /api/health`

```json
{ "status": "Conectado!", "banco": "avalia_cidades" }
```

Em caso de falha na conexão: `500` com `{ "status": "Erro na conexão com PostgreSQL" }`.

### API de Localidades do IBGE

Consulta pública usada diretamente pelo front-end:

```
GET https://servicodados.ibge.gov.br/api/v1/localidades/municipios
```

A aplicação usa o identificador oficial do município, o nome e a sigla da Unidade da Federação.

## Banco de dados

O servidor usa duas tabelas no PostgreSQL. Script de criação:

```sql
CREATE TABLE usuarios (
  id          SERIAL PRIMARY KEY,
  nickname    VARCHAR(30) NOT NULL,
  senha_hash  TEXT NOT NULL,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX usuarios_nickname_unico ON usuarios (LOWER(nickname));

CREATE TABLE avaliacoes (
  id          SERIAL PRIMARY KEY,
  cidade_id   INTEGER NOT NULL,
  cidade      VARCHAR(120) NOT NULL,
  estado      CHAR(2) NOT NULL,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
  notas       JSONB NOT NULL,
  nota        NUMERIC(2,1) NOT NULL,
  comentario  TEXT NOT NULL,
  data        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX avaliacoes_cidade_idx ON avaliacoes (cidade_id);
```

## Como executar

### Pré-requisitos

- Node.js e npm.
- PostgreSQL em execução, com um banco criado e as tabelas acima.
- Conexão com a internet para consultar a API do IBGE.

### 1. Clonar e instalar

```bash
git clone https://github.com/LeonardoAlmeidaRibas/avalia_cidade.git
cd avalia_cidade
npm install
cd server
npm install
```

### 2. Configurar o servidor

Crie o arquivo `server/.env` (já ignorado pelo Git, não envie para o repositório):

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=avalia_cidades
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=uma_chave_longa_e_aleatoria
```

### 3. Iniciar a API

Dentro de `server/`:

```bash
npm run dev     # com nodemon (desenvolvimento)
npm start       # sem nodemon
```

A API ficará em `http://localhost:3001`. Teste em `http://localhost:3001/api/health`.

### 4. Iniciar o front-end

Na raiz do projeto, em outro terminal:

```bash
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.

### Outros comandos (raiz do projeto)

```bash
npm run build    # Gera a versão de produção em dist/
npm run preview  # Executa uma prévia da versão de produção
npm run lint     # Analisa o código com ESLint
```

### Configuração do front-end

O endereço da API de avaliações pode ser alterado pela variável `VITE_API_URL` em um `.env` na raiz:

```env
VITE_API_URL=http://localhost:3001/api/avaliacoes
```

## Organização do código

```
.
├── server/
│   └── src/
│       ├── controllers/      authController.js, avaliacoesController.js
│       ├── database/         db.js (pool do PostgreSQL)
│       ├── middlewares/      authMiddleware.js (validação do JWT)
│       ├── routes/           authRoutes.js, avaliacoesRoutes.js
│       └── server.js
├── src/
│   ├── components/           Autenticacao, PesquisaCidade, FormularioAvaliacao, ListaAvaliacoes
│   ├── services/             authService, avaliacoesService, cidadesService
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
└── db.json                   (legado: dados de exemplo da versão com JSON Server)
```

## Segurança

- Senhas armazenadas com hash bcrypt, nunca em texto puro.
- Rotas de escrita protegidas por JWT com expiração de 1 dia.
- Consultas SQL parametrizadas, evitando SQL injection.
- O arquivo `.env` não deve ser versionado.

## Limitações e próximos passos

- O CORS está liberado para qualquer origem; em produção, restrinja ao domínio do front-end.
- Não há limite de tentativas de login, edição ou exclusão de avaliações, nem moderação de comentários.
- O token fica salvo no `localStorage` do navegador.

## Objetivo acadêmico

Demonstrar o desenvolvimento de uma interface em React que consome APIs, realiza cadastro, autenticação e listagem por meio de uma API REST própria com banco de dados, e apresenta os dados de forma organizada e responsiva.
