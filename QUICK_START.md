# Quick Start Guide - Consult Management API

## 🚀 Início Rápido (5 minutos)

### 1. Clone e Instale
```bash
git clone https://github.com/jamescosjr/consultManagement-WB.git
cd consultManagement-WB
npm install
```

### 2. Configure o Ambiente
Crie arquivo `.env` na raiz:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/consultManagement
JWT_SECRET=seu_secret_aqui_mude_em_producao
NODE_ENV=development
```

### 3. Inicie o MongoDB
```bash
# Com Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Ou inicie o MongoDB local
mongod
```

### 4. Execute o Servidor
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

### 5. Execute os Testes
```bash
npm test
```

---

## 📝 Fluxo de Trabalho Típico

### 1. Criar um Novo Módulo

**Exemplo**: Adicionar entidade "Appointment"

#### Passo 1: Schema
```bash
# Criar arquivo
touch src/infrastructure/schemas/appointment.schema.js
```

```javascript
import mongoose from 'mongoose';

export const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    // ... outros campos
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);
```

#### Passo 2: Repositories
```bash
mkdir -p src/infrastructure/repositories/appointment-repositories
touch src/infrastructure/repositories/appointment-repositories/appointment.repository.read.js
touch src/infrastructure/repositories/appointment-repositories/appointment.repository.write.js
```

**Read**:
```javascript
import { Appointment } from '../../schemas/appointment.schema.js';
import { AppError } from '../../../domain/error/customErros.js';

export async function getAllAppointments(page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;
        return await Appointment.find().skip(skip).limit(limit);
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

export async function getAppointmentById(id) {
    try {
        return await Appointment.findById(id);
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}
```

**Write**:
```javascript
import { Appointment } from '../../schemas/appointment.schema.js';
import { AppError } from '../../../domain/error/customErros.js';

export async function createAppointment(data) {
    try {
        const appointment = new Appointment(data);
        return await appointment.save();
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

export async function updateAppointmentById(id, updateData) {
    try {
        return await Appointment.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

export async function deleteAppointmentById(id) {
    try {
        return await Appointment.findByIdAndDelete(id);
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}
```

#### Passo 3: Validation
```bash
touch src/domain/validation/appointment.js
```

```javascript
export function validateAppointmentData(date, description) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return { valid: false, message: 'The date should be a valid date' };
    }
    if (typeof description !== 'string' || description.trim() === '') {
        return { valid: false, message: 'The description should be a valid string' };
    }
    return { valid: true };
}
```

#### Passo 4: Services
```bash
touch src/domain/services/appointment.service.js
```

```javascript
import { AppError, NotFoundError } from '../error/customErros.js';
import { 
    getAllAppointments,
    getAppointmentById,
} from '../../infrastructure/repositories/appointment-repositories/appointment.repository.read.js';
import { 
    createAppointment,
    updateAppointmentById,
    deleteAppointmentById,
} from '../../infrastructure/repositories/appointment-repositories/appointment.repository.write.js';

export async function createAppointmentService(data) {
    try {
        return await createAppointment(data);
    } catch (error) {
        throw new AppError(error.message || 'Error creating appointment', 500);
    }
}

export async function getAllAppointmentsService(page, limit) {
    try {
        return await getAllAppointments(page, limit);
    } catch (error) {
        throw new AppError(error.message || 'Error getting appointments', 500);
    }
}

export async function getAppointmentByIdService(id) {
    try {
        const appointment = await getAppointmentById(id);
        if (!appointment) {
            throw new NotFoundError('Appointment not found');
        }
        return appointment;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Error getting appointment', 500);
    }
}

export async function updateAppointmentService(id, data) {
    try {
        return await updateAppointmentById(id, data);
    } catch (error) {
        throw new AppError(error.message || 'Error updating appointment', 500);
    }
}

export async function deleteAppointmentService(id) {
    try {
        return await deleteAppointmentById(id);
    } catch (error) {
        throw new AppError(error.message || 'Error deleting appointment', 500);
    }
}
```

#### Passo 5: Controller
```bash
touch src/application/controllers/appointmentController.js
```

```javascript
import { validateAppointmentData } from '../../domain/validation/appointment.js';
import { ValidationError, NotFoundError } from '../../domain/error/customErros.js';
import {
    createAppointmentService,
    getAllAppointmentsService,
    getAppointmentByIdService,
    updateAppointmentService,
    deleteAppointmentService,
} from '../../domain/services/appointment.service.js';

export async function createAppointmentHandler(req, res, next) {
    const { date, description } = req.body;
    
    const validation = validateAppointmentData(new Date(date), description);
    
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }
    
    try {
        const result = await createAppointmentService({ date, description });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function listAppointmentsHandler(req, res, next) {
    const { page = 1, limit = 10 } = req.query;
    
    try {
        const result = await getAllAppointmentsService(Number(page), Number(limit));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getAppointmentByIdHandler(req, res, next) {
    const { id } = req.params;
    
    try {
        const result = await getAppointmentByIdService(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function updateAppointmentHandler(req, res, next) {
    const { id } = req.params;
    const { date, description } = req.body;
    
    const validation = validateAppointmentData(new Date(date), description);
    
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }
    
    try {
        const result = await updateAppointmentService(id, { date, description });
        
        if (!result) {
            return next(new NotFoundError('Appointment not found'));
        }
        
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function deleteAppointmentHandler(req, res, next) {
    const { id } = req.params;
    
    try {
        const result = await deleteAppointmentService(id);
        
        if (!result) {
            return next(new NotFoundError('Appointment not found'));
        }
        
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}
```

#### Passo 6: Routes
Adicione em `src/application/router/routes.js`:

```javascript
import {
    createAppointmentHandler,
    listAppointmentsHandler,
    getAppointmentByIdHandler,
    updateAppointmentHandler,
    deleteAppointmentHandler,
} from '../controllers/appointmentController.js';

// Adicione as rotas
router.post('/appointments', ensureAuthenticated, createAppointmentHandler);
router.get('/appointments', ensureAuthenticated, listAppointmentsHandler);
router.get('/appointments/id/:id', ensureAuthenticated, getAppointmentByIdHandler);
router.put('/appointments/:id', ensureAuthenticated, updateAppointmentHandler);
router.delete('/appointments/:id', ensureAuthenticated, ensureRoles(['root', 'employee']), deleteAppointmentHandler);
```

#### Passo 7: Testes
```bash
mkdir -p src/__tests__/integration/appointments
touch src/__tests__/integration/appointments/create-appointment.test.js
```

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

describe('POST /appointments', () => {
    describe("success cases", () => {
        it("should create a new appointment", async () => {
            const appointment = {
                date: new Date(),
                description: "Test appointment",
            };

            const response = await supertest(app)
                .post("/appointments")
                .send(appointment);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining({
                _id: expect.any(String),
                description: "Test appointment",
                __v: 0,
            }));
        });
    });

    describe("non success cases", () => {
        it("should throw an error if validation fails", async () => {
            const appointment = {
                date: "invalid-date",
                description: "",
            };

            const response = await supertest(app)
                .post("/appointments")
                .send(appointment);

            expect(response.status).toBe(400);
        });
    });
});
```

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Inicia com nodemon (auto-reload)
npm start            # Inicia em modo produção
npm test             # Executa todos os testes
npm test -- --watch  # Executa testes em modo watch
```

### Git
```bash
git status
git add .
git commit -m "feat: adiciona módulo appointments"
git push origin main
```

### MongoDB
```bash
# Conectar ao MongoDB
mongosh

# Usar database
use consultManagement

# Ver coleções
show collections

# Ver documentos
db.patients.find()
db.doctors.find()
db.consults.find()
```

---

## 🐛 Debugging

### Logs
```javascript
// Durante desenvolvimento (remover antes de commit)
console.log('Debug:', variable);

// Use o debugger do Node.js
debugger;
```

### VS Code Debug
Adicione em `.vscode/launch.json`:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug Server",
            "skipFiles": ["<node_internals>/**"],
            "program": "${workspaceFolder}/server.js",
            "env": {
                "NODE_ENV": "development"
            }
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Jest Tests",
            "program": "${workspaceFolder}/node_modules/.bin/jest",
            "args": ["--runInBand"],
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen"
        }
    ]
}
```

---

## 📦 Estrutura de Commits

Use Conventional Commits:

```bash
git commit -m "feat: adiciona listagem de appointments"
git commit -m "fix: corrige validação de data em appointments"
git commit -m "docs: atualiza README com endpoints de appointments"
git commit -m "test: adiciona testes para appointments"
git commit -m "refactor: melhora estrutura de error handling"
git commit -m "style: formata código de appointments"
```

Tipos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `test`: Testes
- `refactor`: Refatoração
- `style`: Formatação
- `chore`: Manutenção

---

## 🔍 Checklist Antes de Fazer PR

- [ ] Código segue AGENT.md
- [ ] Código segue CODING_CONVENTIONS.md
- [ ] Código respeita RESTRICTIONS.md
- [ ] Testes escritos e passando
- [ ] Coverage >= 80%
- [ ] Sem console.log
- [ ] Sem código comentado
- [ ] ESLint sem erros
- [ ] Documentação atualizada
- [ ] Commit messages seguem padrão

---

## 📚 Recursos

### Documentação do Projeto
- [AGENT.md](./AGENT.md) - Guia principal de desenvolvimento
- [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md) - Convenções de código
- [RESTRICTIONS.md](./RESTRICTIONS.md) - Restrições e limitações
- [API_REFERENCE.md](./API_REFERENCE.md) - Referência da API
- [README.md](./README.md) - Visão geral do projeto

### Links Úteis
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Jest](https://jestjs.io/)
- [JWT](https://jwt.io/)
- [MongoDB](https://www.mongodb.com/docs/)

---

## ❓ Dúvidas Comuns

### Como adicionar uma nova rota protegida?
```javascript
router.post('/endpoint', ensureAuthenticated, handlerFunction);
```

### Como restringir por role?
```javascript
router.delete('/endpoint', 
    ensureAuthenticated, 
    ensureRoles(['root', 'employee']), 
    handlerFunction
);
```

### Como fazer relacionamentos entre entidades?
```javascript
// No schema
{
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entity',
        required: true
    }
}

// Verificar existência no service
const entity = await Entity.findById(entityId).lean();
if (!entity) {
    throw new NotFoundError('Entity not found');
}
```

### Como testar uma rota protegida?
```javascript
// 1. Criar usuário e obter token
const loginResponse = await supertest(app)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: '123456' });

const token = loginResponse.body.token;

// 2. Usar token nas requisições
const response = await supertest(app)
    .get('/protected-route')
    .set('Authorization', `Bearer ${token}`);
```

---

**Última atualização**: 25 de novembro de 2025
