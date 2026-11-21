# AvaliaCidades

Aplicação web acadêmica desenvolvida com React para pesquisar municípios brasileiros e compartilhar avaliações sobre diferentes aspectos da experiência de viver ou visitar uma cidade.

## Funcionalidades

- Consulta dos municípios brasileiros por meio da API de Localidades do IBGE.
- Pesquisa de municípios por nome ou sigla do estado.
- Seleção de uma cidade para consultar suas avaliações.
- Cadastro de avaliações com nome, comentário e notas de 1 a 5 para seis critérios: segurança, transporte, saúde, educação, lazer e infraestrutura.
- Cálculo da nota geral de cada avaliação e da média da cidade.
- Exibição da média por critério, quantidade de avaliações e comentários publicados.
- Estados de carregamento, mensagens de erro e confirmação de cadastro.
- Interface responsiva para desktop e dispositivos móveis.

## Tecnologias

- React 19 e JavaScript.
- HTML5 e CSS3.
- Vite.
- JSON Server como API REST local para persistência das avaliações.
- API de Localidades do IBGE para consulta dos municípios.

## APIs utilizadas

### API de Localidades do IBGE

Consulta pública dos municípios brasileiros:

```http
GET https://servicodados.ibge.gov.br/api/v1/localidades/municipios
```

A aplicação utiliza o identificador oficial do município, o nome e a sigla da Unidade da Federação.

### API REST de avaliações (JSON Server)

Por padrão, a API local é executada em `http://localhost:3001`.

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/avaliacoes` | Lista todas as avaliações. |
| GET | `/avaliacoes?cidadeId=4119905` | Lista as avaliações do município informado. |
| GET | `/avaliacoes/:id` | Consulta uma avaliação pelo identificador. |
| POST | `/avaliacoes` | Cadastra uma avaliação. |

#### Exemplo de corpo para POST `/avaliacoes`

```json
{
  "cidadeId": "4119905",
  "cidade": "Ponta Grossa",
  "estado": "PR",
  "autor": "João",
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
```

O campo `nota` representa a média dos seis critérios. Ele é armazenado junto com `notas` para facilitar consultas e manter compatibilidade com avaliações antigas que possuam somente uma nota geral.

#### Estrutura dos dados

O JSON Server utiliza o arquivo `db.json` como armazenamento local. A coleção principal é `avaliacoes`. Cada registro contém o identificador do município (`cidadeId`), cidade, estado, autor, notas por critério, nota geral, comentário e data de publicação.

## Como executar

### Pré-requisitos

- Node.js (versão compatível com a versão do Vite instalada) e npm.
- Conexão com a internet para consultar a API do IBGE.

### Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/LeonardoAlmeidaRibas/avalia_cidade.git
cd avalia_cidade
npm install
```

### Inicialização

Abra dois terminais na pasta do projeto.

**Terminal 1 — API REST:**

```bash
npm run dev:api
```

A API ficará disponível em `http://localhost:3001`.

**Terminal 2 — aplicação React:**

```bash
npm run dev
```

Abra no navegador o endereço informado pelo Vite, normalmente `http://localhost:5173`.

### Outros comandos

```bash
npm run build    # Gera a versão de produção em dist/
npm run preview  # Executa uma prévia da versão de produção
npm run lint     # Analisa o código com ESLint
```

## Configuração da API

O endereço da API de avaliações pode ser alterado pela variável de ambiente `VITE_API_URL`. Crie um arquivo `.env` na raiz do projeto, se necessário:

```env
VITE_API_URL=http://localhost:3001/avaliacoes
```

Se a variável não for definida, a aplicação utiliza esse endereço como padrão.

## Organização do código

```text
src/
├── components/
│   ├── FormularioAvaliacao.jsx
│   ├── ListaAvaliacoes.jsx
│   └── PesquisaCidade.jsx
├── services/
│   ├── avaliacoesService.js
│   └── cidadesService.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx

db.json
```

- `App.jsx`: coordena o carregamento de cidades e avaliações e controla a cidade selecionada.
- `PesquisaCidade.jsx`: pesquisa e seleção de municípios.
- `FormularioAvaliacao.jsx`: valida e envia novas avaliações.
- `ListaAvaliacoes.jsx`: apresenta notas, médias por critério e comentários.
- `services/`: concentra as requisições HTTP às APIs externas e locais.
- `db.json`: base de dados local utilizada pelo JSON Server.

## Limitações e próximos passos

O JSON Server é utilizado como backend simulado para fins acadêmicos; os dados ficam no arquivo local `db.json` e não são compartilhados entre instalações diferentes. A API do IBGE fornece os municípios, mas não fornece as avaliações ou notas exibidas no projeto. Em uma evolução futura, o JSON Server poderá ser substituído por uma API própria com banco de dados, autenticação e regras de moderação.

## Objetivo acadêmico

Demonstrar o desenvolvimento de uma interface em React que consome APIs, realiza operações de cadastro e listagem por meio de uma API REST e apresenta dados de forma organizada e responsiva.
