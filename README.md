# Transfer Service - Backend

# Visão Geral

Este projeto é um serviço de transferência construído com Node.js, Express, Sequelize (ORM), e PostgreSQL como banco de dados. Ele fornece endpoints para gerenciar transferências financeiras, incluindo criação, listagem e validação de dados. O projeto utiliza Docker e Docker Compose para configuração de ambiente, permitindo a execução de serviços backend, frontend e banco de dados.

---

## Estrutura do Projeto

A estrutura de diretórios do projeto é organizada da seguinte forma:

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configurações de banco de dados
│   ├── controllers/
│   │   └── transferController.js # Lógica de negócios para transferências
│   ├── mocks/
│   │   ├── mockSettlementAPI.js # Simulações de integração de liquidação
│   │   └── transfer.js       # Mock de transferências
│   ├── models/
│   │   └── transfer.js       # Modelo para transferências
│   ├── routes/
│   │   └── transfer.js       # Definições de rotas
│   ├── tests/
│   │   ├── mockSettlementAPI.test.js # Testes para o mockSettlementAPI
│   │   └── transferRoutes.test.js    # Testes para as rotas de transferência
├── app.js                     # Configuração inicial do aplicativo
├── server.js                  # Inicialização do servidor
├── Dockerfile                 # Configurações para conteinerização
├── package.json               # Dependências e scripts do Node.js
└── package-lock.json          # Controle de versões das dependências
```
---

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **ORM**: Sequelize
- **Testes**: Jest, Supertest
- **Frontend**: React.js, TailwindCSS (configurado com Docker Compose)
- **Ambiente de Contêiner**: Docker, Docker Compose
---

### Diretórios Principais

- **backend/**: Contém o código-fonte do servidor Express, incluindo rotas, controladores e modelos.
- **mocks/**: Módulos simulados para testes unitários.
- **frontend/**: Contém o código do aplicativo React.
### Configuração de Testes
- **Jest** para testes unitários e integração do backend.
- **Supertest** para simular requisições HTTP e validar respostas do servidor.

---

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- **Docker** e **Docker Compose**
- **Node.js** v18+ (caso deseje rodar localmente sem Docker)
- **PostgreSQL** (se rodar sem Docker)

---

## Configuração com Docker Compose

### Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
DB_NAME=transfer_db
DB_USER=transfer_user
DB_PASSWORD=transfer_password
```

### Arquivo `docker-compose.yml`

```yaml
version: "3.8"
services:
  app:
    build:
      context: ./TransferBackend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_HOST: db
      DB_PORT: 5432
      NODE_ENV: production
    depends_on:
      - db
    volumes:
      - ./TransferBackend:/app 
    command: npm run dev
  db:
    image: postgres:15
    container_name: postgres_transfer_service
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  frontend:
    build:
      context: ./TransferFrontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000" 
    environment:
      REACT_APP_API_URL: "http://app:4000" 
    depends_on:
      - app
    volumes:
      - ./TransferFrontend:/app 
    stdin_open: true
    tty: true

volumes:
  db_data:

```

---

## Instruções para Execução

### Passo 1: Inicializar os contêineres

Execute o seguinte comando para iniciar os serviços:

```bash
docker-compose up --build
```

### Passo 2: Acessar os serviços

- **Backend**: Acesse `http://localhost:4000`
- **Frontend**: Acesse `http://localhost:3000`

### Passo 3: Testar a API

Use ferramentas como **Postman** ou **cURL** para testar os endpoints da API. Exemplos:

#### Criar uma transferência:

```bash
POST http://localhost:4000/api/transfers
Body:
{
  "externalId": "Texte123",
  "amount": 104.5,
  "expectedOn": "2024-12-31"
}
```

#### Listar transferências:

```bash
GET http://localhost:4000/api/transfers
```

---

## Testes

### Executar os Testes

```bash
npm run test
```

### Cobertura

- **Unit Tests**: Validação de funções e lógica de negócios.
- **Integration Tests**: Testes de integração para endpoints.

---
