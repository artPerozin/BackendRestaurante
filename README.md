# 🍽️ Backend Restaurante

API REST robusta desenvolvida para o desafio Nola-god-level

## 🏗️ Arquitetura

O projeto foi desenvolvido utilizando as seguintes arquiteturas e padrões:

### **DDD (Domain-Driven Design)**
Organização do código focada no domínio do negócio, com separação clara entre camadas e contextos delimitados.

### **Clean Architecture**
Arquitetura em camadas que promove independência de frameworks, testabilidade e separação de responsabilidades:
- **Entities (Domain)**: Regras de negócio da aplicação
- **Use Cases**: Lógica de aplicação
- **Interface Adapters**: Controllers, Presenters, Gateways

### **Arquitetura Hexagonal (Ports & Adapters)**
Isola a lógica de negócio de dependências externas através de portas (interfaces) e adaptadores (implementações).

### **TDD (Test-Driven Development)**
Desenvolvimento guiado por testes, garantindo cobertura de código e comportamento esperado desde o início.

### **Clean Code**
Código limpo, legível e auto-documentado seguindo as melhores práticas de Robert C. Martin.

### **SOLID Principles**
- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

## 🚀 Tecnologias

### Core
- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web minimalista

### Database
- **pg-promise** - Interface PostgreSQL para Node.js

### Segurança
- **bcrypt** - Hashing de senhas
- **jsonwebtoken** - Autenticação JWT

### Documentação
- **Swagger UI Express** - Interface visual da documentação
- **Swagger JSDoc** - Geração de documentação OpenAPI

### Testes
- **Jest** - Framework de testes
- **ts-jest** - Preset TypeScript para Jest

### Utilidades
- **axios** - Cliente HTTP
- **dotenv** - Gerenciamento de variáveis de ambiente
- **uuid** - Geração de identificadores únicos
- **mammoth** - Processamento de documentos Word

## 📦 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- PostgreSQL
- Git

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/artPerozin/BackendRestaurante.git
cd BackendRestaurante
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto (coloque as credenciais do db):
```env
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```

## 🎮 Como Usar

### Desenvolvimento

Execute a aplicação em modo de desenvolvimento:

```bash
npm run main
```

A API estará disponível em: `http://localhost:8000`

### Executar Testes

Execute todos os testes:

```bash
npm run test
```

Os testes serão executados sequencialmente (`--runInBand`) para evitar conflitos de banco de dados.

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI:

🔗 **URL**: `http://localhost:8000/api-docs/`

A documentação inclui:
- ✅ Todos os endpoints disponíveis
- ✅ Modelos de requisição e resposta
- ✅ Códigos de status HTTP
- ✅ Exemplos de uso
- ✅ Testes interativos

## 👤 Autor

**Arthur Perozin**
- Email: perozin.arthur@gmail.com
- GitHub: (https://github.com/artPerozin)

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!

**Versão**: 0.0.1 | **Status**: Em Desenvolvimento �