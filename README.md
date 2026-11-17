# AvaliaCidades

Aplicação web desenvolvida em ReactJS para permitir que usuários pesquisem cidades brasileiras, compartilhem experiências e publiquem avaliações sobre os municípios.

## Objetivo

O projeto tem como objetivo oferecer uma plataforma para consultar informações sobre cidades e compartilhar opiniões relacionadas à qualidade de vida, infraestrutura, segurança, lazer e experiências pessoais.

## Tecnologias utilizadas

- **ReactJS:** desenvolvimento da interface.
- **JavaScript:** lógica da aplicação.
- **HTML5 e CSS3:** estrutura e estilização.
- **Vite:** ambiente de desenvolvimento.
- **Node.js e npm:** gerenciamento de dependências.
- **JSON Server:** simulação da API REST de avaliações.
- **API do IBGE:** consulta dos municípios brasileiros.

## APIs utilizadas

### 1. API de Localidades do IBGE

API pública utilizada para consultar informações sobre os municípios brasileiros.

**Endpoint:**

`GET https://servicodados.ibge.gov.br/api/v1/localidades/municipios`

### 2. API REST de avaliações — JSON Server

API local utilizada para armazenar e consultar avaliações dos usuários.

**Endpoints:**

- `GET /avaliacoes` — lista todas as avaliações.
- `GET /avaliacoes?cidadeId=4119905` — lista avaliações de uma cidade específica.
- `POST /avaliacoes` — cadastra uma nova avaliação.

**Exemplo de avaliação em JSON:**

```json
{
  "cidadeId": 4119905,
  "cidade": "Ponta Grossa",
  "estado": "PR",
  "autor": "João",
  "nota": 4,
  "comentario": "Cidade tranquila e agradável."
}
```

## Como executar o projeto

**Pré-requisito:** Node.js e npm instalados.

1. Clone o repositório.
2. Abra a pasta do projeto.
3. Execute `npm install` para instalar as dependências.
4. Execute `npm run dev` para iniciar o React.
5. Em outro terminal, execute `npx json-server db.json --port 3001` para iniciar a API local.

A aplicação estará disponível no endereço indicado pelo Vite, normalmente `http://localhost:5173`.

## Funcionalidades previstas

- Pesquisa de cidades brasileiras.
- Cadastro de avaliações com notas e comentários.
- Listagem de avaliações por cidade.
- Cálculo da média das avaliações.

## Desenvolvimento futuro

Está prevista a implementação de uma API REST própria com integração ao PostgreSQL, substituindo o armazenamento simulado do JSON Server.

## Sobre o projeto

Projeto acadêmico desenvolvido para demonstrar o consumo de APIs REST e a implementação de funcionalidades de cadastro e listagem utilizando ReactJS.