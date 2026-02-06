# Convenções de Código - Consult Management API

## 📋 Índice
1. [Nomenclatura](#nomenclatura)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Imports e Exports](#imports-e-exports)
4. [Funções e Métodos](#funções-e-métodos)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Comentários](#comentários)
7. [Formatação](#formatação)

---

## 🏷️ Nomenclatura

### Variáveis e Constantes
```javascript
// ✅ Correto - camelCase para variáveis
const patientName = "João Silva";
const consultDate = new Date();
let currentPage = 1;

// ✅ Correto - UPPER_CASE para constantes globais
const JWT_SECRET = process.env.JWT_SECRET;
const MAX_RETRY_ATTEMPTS = 3;

// ❌ Incorreto
const patient_name = "João";  // snake_case
const PatientName = "João";   // PascalCase
```

### Funções
```javascript
// ✅ Correto - camelCase, verbos descritivos
async function createPatient() {}
async function updatePatientById() {}
async function getAllPatients() {}
async function findPatientByName() {}

// ❌ Incorreto
async function patient() {}      // sem verbo
async function Patient() {}      // PascalCase
async function get_patient() {}  // snake_case
```

### Classes e Schemas
```javascript
// ✅ Correto - PascalCase
class AppError extends Error {}
class NotFoundError extends AppError {}
export const Patient = mongoose.model('Patient', patientSchema);

// ❌ Incorreto
class appError {}
class notfound_error {}
```

### Arquivos
```javascript
// ✅ Correto
patient.service.js
patient.repository.read.js
patientController.js
customErros.js

// ❌ Incorreto
PatientService.js
patient-repository-read.js
patient_controller.js
```

---

## 📁 Estrutura de Arquivos

### Controllers
```
src/application/controllers/
├── patientController.js
├── doctorController.js
├── consultController.js
└── authController.js
```

**Padrão de Nomenclatura**: `[entity]Controller.js`

### Services
```
src/domain/services/
├── patient.service.js
├── doctor.service.js
├── consult.service.js
└── authService.js
```

**Padrão de Nomenclatura**: `[entity].service.js`

### Repositories
```
src/infrastructure/repositories/
├── patient-repositories/
│   ├── patient.repository.read.js
│   └── patient.repository.write.js
├── doctor-repositories/
│   ├── doctor.repository.read.js
│   └── doctor.repository.write.js
└── consult-repositories/
    ├── consult.repository.read.js
    └── consult.repository.write.js
```

**Padrão de Nomenclatura**: 
- Pasta: `[entity]-repositories/`
- Arquivo: `[entity].repository.[read|write].js`

---

## 📥 Imports e Exports

### Ordem de Imports
```javascript
// 1. Dependências externas (npm packages)
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// 2. Módulos de domínio
import { AppError, NotFoundError } from '../error/customErros.js';
import { validatePatientData } from '../validation/patient.js';

// 3. Repositories e schemas
import { Patient } from '../../infrastructure/schemas/patient.schema.js';
import { getAllPatients } from '../../infrastructure/repositories/patient-repositories/patient.repository.read.js';

// 4. Configurações locais
import config from './config.js';
```

### Named Exports (Preferido)
```javascript
// ✅ Correto - Named exports
export async function createPatientService() {}
export async function updatePatientService() {}

// Import
import { createPatientService, updatePatientService } from './patient.service.js';
```

### Default Exports
```javascript
// ✅ Correto - Para routers e middlewares
const router = Router();
export default router;

// ✅ Correto - Para error handler
export default function errorHandler(err, req, res, next) {}

// Import
import router from './routes.js';
import errorHandler from './errorHandler.js';
```

### Sempre Incluir Extensão .js
```javascript
// ✅ Correto
import { Patient } from './patient.schema.js';

// ❌ Incorreto
import { Patient } from './patient.schema';
```

---

## ⚙️ Funções e Métodos

### Funções Async
```javascript
// ✅ Correto - Sempre async/await
export async function createPatientService({ name, age }) {
    try {
        const patient = await createPatient({ name, age });
        return patient;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

// ❌ Incorreto - Promises encadeadas
export function createPatientService({ name, age }) {
    return createPatient({ name, age })
        .then(patient => patient)
        .catch(error => {
            throw new AppError(error.message, 500);
        });
}
```

### Destructuring de Parâmetros
```javascript
// ✅ Correto - Objeto como parâmetro
export async function createPatientService({ name, age }) {
    // ...
}

// ✅ Correto - Chamada
await createPatientService({ name: "João", age: 30 });

// ❌ Incorreto - Múltiplos parâmetros posicionais (mais de 3)
export async function createPatientService(name, age, address, phone, email) {
    // difícil de lembrar a ordem
}
```

### Arrow Functions vs Function Declaration
```javascript
// ✅ Correto - Function declaration para exports principais
export async function createPatientHandler(req, res, next) {}

// ✅ Correto - Arrow function para callbacks e utilidades
const validateAndCreate = async (data) => {
    // ...
};

router.post('/patients', async (req, res, next) => {
    // ...
});

// ✅ Correto - Higher-order functions
export const ensureRoles = (requiredRoles) => {
    return (req, res, next) => {
        // ...
    };
};
```

---

## 🚨 Tratamento de Erros

### Hierarquia de Erros
```javascript
AppError          // Base (500)
├── NotFoundError (404)
└── ValidationError (400)
```

### Em Services
```javascript
// ✅ Correto
export async function getPatientByIdService(id) {
    try {
        const patient = await getPatientById(id);
        
        if (!patient) {
            throw new NotFoundError('Patient not found');
        }
        
        return patient;
    } catch (error) {
        // Re-throw se já for AppError
        if (error instanceof AppError) {
            throw error;
        }
        // Wrap outros erros
        throw new AppError(error.message || 'Error getting the Patient', 500);
    }
}

// ❌ Incorreto - Silenciar erros
export async function getPatientByIdService(id) {
    try {
        return await getPatientById(id);
    } catch (error) {
        return null;  // ❌ Não fazer isso!
    }
}
```

### Em Controllers
```javascript
// ✅ Correto
export async function getPatientByIdHandler(req, res, next) {
    const { id } = req.params;
    
    try {
        const result = await getPatientByIdService(id);
        
        if (!result) {
            return next(new NotFoundError('Patient not found'));
        }
        
        res.status(200).json(result);
    } catch (error) {
        next(error);  // Passar para error handler
    }
}

// ❌ Incorreto - Não passar para next
export async function getPatientByIdHandler(req, res, next) {
    try {
        const result = await getPatientByIdService(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });  // ❌
    }
}
```

### Em Repositories
```javascript
// ✅ Correto - AppError genérico
export async function getPatientById(id) {
    try {
        return await Patient.findById(id);
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

// ❌ Incorreto - NotFoundError em repository
export async function getPatientById(id) {
    const patient = await Patient.findById(id);
    if (!patient) {
        throw new NotFoundError('Patient not found');  // ❌ Lógica de negócio
    }
    return patient;
}
```

---

## 💬 Comentários

### Quando Comentar
```javascript
// ✅ Correto - Explicar "por quê", não "o quê"
// Remover consulta dos arrays de paciente e médico ao deletar
await updateDoctorById(consult.doctorId, removeOperations);
await updatePatientById(consult.patientId, removeOperations);

// ✅ Correto - Avisos importantes
// ATENÇÃO: Não remover este try-catch, é necessário para transações
try {
    await session.commitTransaction();
} catch (error) {
    await session.abortTransaction();
}

// ❌ Incorreto - Comentar código óbvio
// Buscar paciente por ID
const patient = await Patient.findById(id);

// ❌ Incorreto - Código comentado
// const oldFunction = () => {
//     return something;
// }
```

### JSDoc para Funções Públicas
```javascript
/**
 * Cria um novo paciente no sistema
 * @param {Object} data - Dados do paciente
 * @param {string} data.name - Nome do paciente
 * @param {number} data.age - Idade do paciente
 * @returns {Promise<Object>} Paciente criado
 * @throws {ValidationError} Se dados inválidos
 * @throws {AppError} Se erro no banco de dados
 */
export async function createPatientService({ name, age }) {
    // ...
}
```

---

## 🎨 Formatação

### Indentação
- **4 espaços** (não tabs)
- Consistente em todo o projeto

### Linhas em Branco
```javascript
// ✅ Correto
import express from 'express';
import mongoose from 'mongoose';

export async function createPatient() {
    const patient = new Patient();
    
    await patient.save();
    
    return patient;
}

export async function updatePatient() {
    // ...
}
```

### Comprimento de Linha
- Máximo **100 caracteres**
- Quebrar em múltiplas linhas se necessário

```javascript
// ✅ Correto
const validation = validatePatientData(
    patientName, 
    patientAge, 
    patientAddress
);

// ✅ Correto - Destructuring
const {
    name,
    age,
    address,
    phone,
    email
} = req.body;
```

### Strings
```javascript
// ✅ Preferir aspas simples
const message = 'Patient not found';
const name = 'João Silva';

// ✅ Template literals para interpolação
const message = `Patient ${name} not found`;
const url = `/patients/${id}`;

// ❌ Evitar concatenação
const message = 'Patient ' + name + ' not found';
```

### Objetos
```javascript
// ✅ Correto
const patient = {
    name: 'João',
    age: 30,
    consultIds: []
};

// ✅ Correto - Uma propriedade por linha quando muitas
const consultation = {
    date: new Date(),
    shift: 'morning',
    doctorId: doctor._id,
    patientId: patient._id,
    description: 'Consulta de rotina'
};

// ❌ Incorreto - Misturar estilos
const patient = { name: 'João', age: 30,
    consultIds: [] };
```

### Arrays
```javascript
// ✅ Correto
const roles = ['root', 'doctor', 'employee'];

// ✅ Correto - Múltiplas linhas para arrays grandes
const permissions = [
    'create:patient',
    'read:patient',
    'update:patient',
    'delete:patient'
];
```

---

## 🔍 ESLint

### Configuração Atual
O projeto usa ESLint com:
- `@eslint/js` configuração recomendada
- Suporte a Jest
- Globals do browser e Jest

### Executar Linting
```bash
# Verificar erros
npm run lint

# Corrigir automaticamente
npm run lint:fix
```

### Regras Importantes
- Sem `console.log` em produção (use logging adequado)
- Sempre usar `===` em vez de `==`
- Declarar variáveis antes de usar
- Sem variáveis não utilizadas

---

## ✅ Checklist Antes de Commit

- [ ] Código segue padrões de nomenclatura
- [ ] Imports organizados corretamente
- [ ] Funções async com try-catch
- [ ] Erros tratados adequadamente
- [ ] Sem código comentado
- [ ] Sem console.log desnecessários
- [ ] Testes passando (`npm test`)
- [ ] ESLint sem erros
- [ ] Documentação atualizada se necessário

---

## Testes

- Toda nova funcionalidade ou alteração no código existente deve ser acompanhada de testes adequados (unitários e/ou de integração).
- Certifique-se de que os testes cubram os casos de uso principais e cenários de erro.
- Utilize a estrutura de testes existente no projeto para manter consistência.

---

## Git: Seleção de Arquivos

- **Evite adicionar arquivos desnecessários**: Antes de cada commit, revise os arquivos adicionados com `git status` e `git diff`.
- **Use o `.gitignore`**: Certifique-se de que arquivos temporários, de configuração local ou gerados automaticamente (como `node_modules`, arquivos de build, e credenciais) estejam listados no `.gitignore`.
- **Commits pequenos e descritivos**: Faça commits que sejam pequenos e focados em uma única mudança ou funcionalidade. Use mensagens claras e descritivas.
- **Não comite segredos**: Nunca adicione credenciais, chaves privadas ou informações sensíveis ao repositório. Utilize variáveis de ambiente ou ferramentas como o `dotenv`.
- **Arquivos de log e cache**: Certifique-se de que arquivos como `*.log` e `*.cache` não sejam adicionados ao repositório.

---

**Última atualização**: 25 de novembro de 2025
