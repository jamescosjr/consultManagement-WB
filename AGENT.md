# AGENT.MD - Guia de Desenvolvimento do Projeto

## 📋 Visão Geral do Projeto

**Consult Management API** é uma API RESTful para gerenciamento de consultas médicas, implementada em Node.js com Express e MongoDB, seguindo princípios de Clean Architecture/DDD.

---

## 🏗️ Arquitetura

### Estrutura de Camadas

O projeto segue uma arquitetura em três camadas:

```
src/
├── application/       # Camada de Aplicação
├── domain/           # Camada de Domínio
└── infrastructure/   # Camada de Infraestrutura
```

#### 1. **Application Layer** (`src/application/`)
- **Responsabilidade**: Interface com o mundo externo (HTTP)
- **Componentes**:
  - `controllers/`: Manipuladores de requisições HTTP
  - `middleware/`: Middlewares (auth, errorHandler)
  - `router/`: Definição de rotas
  - `contracts/`: Contratos de API (OpenAPI/Swagger)

#### 2. **Domain Layer** (`src/domain/`)
- **Responsabilidade**: Lógica de negócio e regras do domínio
- **Componentes**:
  - `services/`: Serviços de domínio com regras de negócio
  - `validation/`: Validações de dados de entrada
  - `error/`: Classes de erro customizadas
  - `utils/`: Utilitários de domínio

#### 3. **Infrastructure Layer** (`src/infrastructure/`)
- **Responsabilidade**: Detalhes de implementação e persistência
- **Componentes**:
  - `schemas/`: Schemas do Mongoose (modelos de dados)
  - `repositories/`: Acesso a dados (separados em read/write)

---

## 📐 Princípios de Arquitetura

### 1. **Separação de Responsabilidades**
- **Controllers**: Apenas validam entrada e chamam services
- **Services**: Contêm lógica de negócio
- **Repositories**: Apenas acessam o banco de dados

### 2. **Dependency Rule**
```
Application → Domain → Infrastructure
```
- Camadas externas dependem de camadas internas
- Camadas internas não conhecem camadas externas
- Domain é independente de frameworks

### 3. **Repository Pattern**
Separação de leitura e escrita (CQRS simplificado):
- `*.repository.read.js`: Operações de leitura
- `*.repository.write.js`: Operações de escrita

---

## 🔧 Regras de Implementação

### 1. **Nomenclatura**

#### Controllers
```javascript
// Padrão: [action][Entity]Handler
export async function createPatientHandler(req, res, next) {}
export async function updateDoctorHandler(req, res, next) {}
export async function listConsultsHandler(req, res, next) {}
```

#### Services
```javascript
// Padrão: [action][Entity]Service
export async function createPatientService({ name, age }) {}
export async function updateDoctorService(id, { name, specialty }) {}
export async function getAllConsultsService() {}
```

#### Repositories
```javascript
// Read: get/find/list
export async function getPatientById(id) {}
export async function getAllPatients(page, limit) {}

// Write: create/update/delete
export async function createPatient({ name, age }) {}
export async function updatePatientById(id, updateData) {}
export async function deletePatientById(id) {}
```

### 2. **Tratamento de Erros**

#### Classes de Erro Disponíveis
```javascript
// src/domain/error/customErros.js
AppError        // Erro genérico (500)
NotFoundError   // Recurso não encontrado (404)
ValidationError // Dados inválidos (400)
```

#### Uso em Services
```javascript
export async function createPatientService({ name, age }) {
    try {
        return await createPatient({ name, age });
    } catch (error) {
        throw new AppError(error.message || 'Error creating the Patient', 500);
    }
}
```

#### Uso em Controllers
```javascript
export async function createPatientHandler(req, res, next) {
    const { name, age } = req.body;
    
    const validation = validatePatientData(name, age);
    
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }

    try {
        const result = await createPatientService({ name, age });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}
```

### 3. **Validação de Dados**

#### Estrutura de Validação
```javascript
// src/domain/validation/[entity].js
export function validatePatientData(name, age) {
    if (typeof name !== 'string' || name.trim() === '') {
        return { valid: false, message: 'The name should be a valid string' };
    }
    if (typeof age !== 'number' || isNaN(age)) {
        return { valid: false, message: 'The age should be a valid number' };
    }
    return { valid: true };
}
```

**REGRA**: Sempre validar no controller antes de chamar o service.

### 4. **Schemas do Mongoose**

#### Estrutura Base
```javascript
import mongoose from 'mongoose';

export const [entity]Schema = new mongoose.Schema({
    // campos obrigatórios
    name: {
        type: String,
        required: true
    },
    // relacionamentos
    consultIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Consult',
        default: []
    }
});

export const [Entity] = mongoose.model('[Entity]', [entity]Schema);
```

### 5. **Rotas**

#### Padrão de Rotas
```javascript
// CRUD básico
router.post('/[entities]', create[Entity]Handler);
router.get('/[entities]', list[Entities]Handler);
router.get('/[entities]/id/:id', get[Entity]ByIdHandler);
router.put('/[entities]/:id', update[Entity]Handler);
router.delete('/[entities]/:id', delete[Entity]Handler);

// Rotas customizadas
router.get('/[entities]/[field]/:value', get[Entity]By[Field]Handler);
```

### 6. **Autenticação e Autorização**

#### Middleware de Autenticação
```javascript
// Uso: proteger rotas que requerem autenticação
router.post('/consults', ensureAuthenticated, createConsultHandler);
```

#### Middleware de Autorização
```javascript
// Uso: restringir acesso por roles
router.delete('/consults/:id', 
    ensureAuthenticated, 
    ensureRoles(['root', 'doctor']), 
    deleteConsultHandler
);
```

#### Roles Disponíveis
- `root`: Acesso total
- `doctor`: Médico
- `employee`: Funcionário
- `client`: Cliente/Paciente

---

## 🧪 Testes

### Estrutura de Testes
```
src/__tests__/
└── integration/
    ├── consults/
    ├── doctors/
    └── patients/
```

### Padrão de Testes de Integração
```javascript
import supertest from "supertest";
import { app } from "../../../../server";
const dbHandler = require('../../../../jest/jest.setup');

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe('POST /[entities]', () => {
    describe("success cases", () => {
        it("should create a new [entity]", async () => {
            // test implementation
        });
    });

    describe("non success cases", () => {
        it("should throw an error if validation fails", async () => {
            // test implementation
        });
    });
});
```

### Executar Testes
```bash
npm test              # Executa testes com coverage
npm run dev          # Modo desenvolvimento com nodemon
npm start            # Produção
```

---

## 📝 Regras de Código

### 1. **Imports**
- Sempre usar ES6 modules (`import/export`)
- Usar extensão `.js` nos imports
- Ordem: libs externas → internos (camada por camada)

```javascript
// Correto
import express from 'express';
import mongoose from 'mongoose';
import { createPatientService } from '../../domain/services/patient.service.js';
import { Patient } from '../../infrastructure/schemas/patient.schema.js';
```

### 2. **Async/Await**
- Sempre usar `async/await` em vez de Promises
- Sempre envolver em `try/catch`
- Sempre passar erros para `next()` em controllers

### 3. **Status HTTP**
```javascript
201 // Created (POST bem-sucedido)
200 // OK (GET, PUT bem-sucedidos)
204 // No Content (DELETE bem-sucedido)
400 // Bad Request (Validação falhou)
401 // Unauthorized (Token inválido/ausente)
403 // Forbidden (Sem permissão)
404 // Not Found (Recurso não encontrado)
500 // Internal Server Error (Erro do servidor)
```

### 4. **Mensagens de Erro**
- Em português
- Claras e descritivas
- Consistentes com o padrão existente

```javascript
'Token não fornecido'
'Acesso negado. Permissão insuficiente.'
'Patient not found'
'The name should be a valid string'
```

---

## 🔄 Fluxo de Dados

### Request → Response
```
1. HTTP Request
   ↓
2. Router (routes.js)
   ↓
3. Middleware (auth, validation)
   ↓
4. Controller
   - Extrai dados do req
   - Valida entrada
   - Chama service
   ↓
5. Service
   - Aplica regras de negócio
   - Chama repositories
   ↓
6. Repository
   - Acessa MongoDB
   - Retorna dados
   ↓
7. Service → Controller → Response
```

---

## 🚫 O Que NÃO Fazer

### ❌ Controllers
- ❌ Não colocar lógica de negócio
- ❌ Não acessar banco de dados diretamente
- ❌ Não fazer validações complexas (use validation/)

### ❌ Services
- ❌ Não acessar `req` ou `res`
- ❌ Não retornar status HTTP
- ❌ Não acessar schemas diretamente (use repositories)

### ❌ Repositories
- ❌ Não colocar lógica de negócio
- ❌ Não fazer validações
- ❌ Não lançar erros customizados do domínio (use AppError genérico)

---

## 📦 Entidades do Sistema

### 1. **Patient** (Paciente)
```javascript
{
    name: String,
    age: Number,
    consultIds: [ObjectId] // ref: Consult
}
```

### 2. **Doctor** (Médico)
```javascript
{
    name: String,
    specialty: String,
    consultIds: [ObjectId] // ref: Consult
}
```

### 3. **Consult** (Consulta)
```javascript
{
    date: Date,
    shift: String,
    doctorId: ObjectId,   // ref: Doctor
    patientId: ObjectId,  // ref: Patient
    description: String
}
```

### 4. **User** (Usuário)
```javascript
{
    name: String,
    email: String,
    passwordHash: String,
    role: Enum['root', 'client', 'doctor', 'employee']
}
```

---

## 🔐 Variáveis de Ambiente

Criar arquivo `.env` na raiz:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/consultManagement
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

## 🆕 Adicionando Novas Features

### Checklist para Nova Entidade

1. **Schema** (`infrastructure/schemas/[entity].schema.js`)
   - Definir modelo Mongoose
   - Exportar schema e model

2. **Repositories** (`infrastructure/repositories/[entity]-repositories/`)
   - `[entity].repository.read.js`: operações de leitura
   - `[entity].repository.write.js`: operações de escrita

3. **Validation** (`domain/validation/[entity].js`)
   - Funções de validação de dados

4. **Services** (`domain/services/[entity].service.js`)
   - Lógica de negócio
   - Tratamento de erros

5. **Controller** (`application/controllers/[entity]Controller.js`)
   - Handlers para cada operação
   - Validação e delegação para services

6. **Routes** (`application/router/routes.js`)
   - Adicionar rotas no router

7. **Tests** (`__tests__/integration/[entity]/`)
   - Testes para cada operação
   - Success e error cases

---

## 🐛 Problemas Conhecidos

### 1. **Import do AppError**
⚠️ **ATENÇÃO**: Há inconsistência nos imports de `AppError`:
- Alguns arquivos importam de `customErros.js`
- `authMiddleware.js` importa de `errorHandler.js` (incorreto)

**Solução**: Sempre importar de:
```javascript
import { AppError } from '../../../domain/error/customErros.js';
```

### 2. **Import Faltando em Services**
Alguns services usam `AppError` mas não importam. Sempre adicionar:
```javascript
import { AppError, NotFoundError } from "../error/customErros.js";
```

### 3. **User Schema**
Há import não utilizado:
```javascript
import { getDoctorByName } from '../repositories/doctor-repositories/doctor.repository.read';
```
Deve ser removido.

---

## 📚 Referências

- **Express**: https://expressjs.com/
- **Mongoose**: https://mongoosejs.com/
- **JWT**: https://jwt.io/
- **Jest**: https://jestjs.io/
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

---

## 🔄 Versionamento

### Commits
Use conventional commits:
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
test: adiciona/corrige testes
refactor: refatora código
style: formatação
```

### Branches
- `main`: produção
- `develop`: desenvolvimento
- `feature/[nome]`: novas features
- `fix/[nome]`: correções

---

**Última atualização**: 25 de novembro de 2025
