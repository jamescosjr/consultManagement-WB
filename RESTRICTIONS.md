# Restrições e Limitações - Consult Management API

## 🚫 Restrições Arquiteturais

### 1. Separação de Camadas

#### ❌ Controllers NÃO PODEM:
- Acessar diretamente Schemas do Mongoose
- Conter lógica de negócio
- Fazer queries ao banco de dados
- Importar de `infrastructure/schemas`
- Importar de `infrastructure/repositories`

```javascript
// ❌ ERRADO
import { Patient } from '../../infrastructure/schemas/patient.schema.js';

export async function createPatientHandler(req, res, next) {
    const patient = await Patient.create(req.body);  // ❌ Acesso direto ao DB
    res.json(patient);
}

// ✅ CORRETO
import { createPatientService } from '../../domain/services/patient.service.js';

export async function createPatientHandler(req, res, next) {
    const result = await createPatientService(req.body);  // ✅ Delega ao service
    res.json(result);
}
```

#### ❌ Services NÃO PODEM:
- Acessar objetos `req`, `res`, `next` do Express
- Retornar status HTTP
- Acessar Schemas diretamente (devem usar repositories)
- Fazer validação de formato HTTP (apenas validação de negócio)

```javascript
// ❌ ERRADO
import { Patient } from '../../infrastructure/schemas/patient.schema.js';

export async function createPatientService(req, res) {
    const patient = await Patient.create(req.body);  // ❌ Acessa req/res e Schema
    res.status(201).json(patient);  // ❌ Retorna HTTP
}

// ✅ CORRETO
import { createPatient } from '../../infrastructure/repositories/patient-repositories/patient.repository.write.js';

export async function createPatientService({ name, age }) {
    return await createPatient({ name, age });  // ✅ Usa repository, retorna dados
}
```

#### ❌ Repositories NÃO PODEM:
- Conter lógica de negócio
- Fazer validações (exceto validações do Mongoose)
- Lançar erros de domínio específicos (NotFoundError, ValidationError)
- Chamar outros repositories (apenas acessar o próprio Schema)

```javascript
// ❌ ERRADO
export async function getPatientById(id) {
    const patient = await Patient.findById(id);
    
    if (!patient) {
        throw new NotFoundError('Patient not found');  // ❌ Lógica de negócio
    }
    
    // ❌ Validação de negócio
    if (patient.age < 0) {
        throw new ValidationError('Invalid age');
    }
    
    return patient;
}

// ✅ CORRETO
export async function getPatientById(id) {
    try {
        return await Patient.findById(id);  // ✅ Apenas acessa DB
    } catch (error) {
        throw new AppError(error.message, 500);  // ✅ Apenas AppError genérico
    }
}
```

---

## 🔒 Restrições de Acesso ao Banco de Dados

### 1. CQRS Simplificado - Separação Read/Write

#### Read Operations (`*.repository.read.js`)
**PERMITIDO APENAS**:
- `find()`
- `findById()`
- `findOne()`
- `count()`
- `aggregate()` (apenas leitura)

```javascript
// ✅ CORRETO - patient.repository.read.js
export async function getAllPatients() {
    return await Patient.find();
}

export async function getPatientById(id) {
    return await Patient.findById(id);
}
```

#### Write Operations (`*.repository.write.js`)
**PERMITIDO APENAS**:
- `create()`
- `save()`
- `findByIdAndUpdate()`
- `findByIdAndDelete()`
- `updateOne()`
- `deleteOne()`

```javascript
// ✅ CORRETO - patient.repository.write.js
export async function createPatient({ name, age }) {
    const patient = new Patient({ name, age });
    return await patient.save();
}

export async function updatePatientById(id, updateData) {
    return await Patient.findByIdAndUpdate(id, updateData, { new: true });
}
```

#### ❌ NÃO MISTURAR Read e Write

```javascript
// ❌ ERRADO - Em patient.repository.read.js
export async function getAndUpdatePatient(id, data) {
    return await Patient.findByIdAndUpdate(id, data);  // ❌ Write em arquivo Read
}

// ❌ ERRADO - Em patient.repository.write.js
export async function updateIfExists(id, data) {
    const patient = await Patient.findById(id);  // ❌ Read em arquivo Write
    if (patient) {
        return await Patient.findByIdAndUpdate(id, data);
    }
}
```

---

## 🔐 Restrições de Autenticação e Autorização

### 1. Rotas Públicas vs Protegidas

#### ❌ NÃO PERMITIDO - Rotas Sensíveis Sem Auth
```javascript
// ❌ ERRADO
router.delete('/patients/:id', deletePatientHandler);  // Sem proteção
router.post('/consults', createConsultHandler);  // Sem autenticação
```

#### ✅ OBRIGATÓRIO - Proteger Rotas Sensíveis
```javascript
// ✅ CORRETO
router.delete('/patients/:id', 
    ensureAuthenticated, 
    ensureRoles(['root', 'employee']),
    deletePatientHandler
);

router.post('/consults', 
    ensureAuthenticated,
    createConsultHandler
);
```

### 2. Hierarquia de Roles

```
root > employee > doctor > client
```

#### Permissões por Role
```javascript
// root: TUDO
// employee: Create, Read, Update, Delete (CRUD completo em pacientes e médicos)
// doctor: CRUD em consultas próprias, Read em pacientes
// client: Read próprio perfil, Read próprias consultas
```

#### ❌ NÃO PERMITIDO - Hardcode de Lógica de Roles
```javascript
// ❌ ERRADO - No controller
export async function deletePatientHandler(req, res, next) {
    if (req.user.role !== 'root') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    // ...
}
```

#### ✅ USAR Middleware de Autorização
```javascript
// ✅ CORRETO
router.delete('/patients/:id',
    ensureAuthenticated,
    ensureRoles(['root', 'employee']),  // Middleware centralizado
    deletePatientHandler
);
```

---

## 📊 Restrições de Dados

### 1. Validação Obrigatória

#### ❌ NÃO PERMITIDO - Criar Sem Validar
```javascript
// ❌ ERRADO
export async function createPatientHandler(req, res, next) {
    const result = await createPatientService(req.body);  // Sem validação
    res.status(201).json(result);
}
```

#### ✅ SEMPRE Validar Antes
```javascript
// ✅ CORRETO
export async function createPatientHandler(req, res, next) {
    const { name, age } = req.body;
    
    const validation = validatePatientData(name, age);
    
    if (!validation.valid) {
        return next(new ValidationError(validation.message));
    }
    
    const result = await createPatientService({ name, age });
    res.status(201).json(result);
}
```

### 2. Tipos de Dados Permitidos

#### Patient
```javascript
{
    name: String,        // OBRIGATÓRIO, não vazio
    age: Number,         // OBRIGATÓRIO, >= 0
    consultIds: Array    // OPCIONAL, apenas ObjectIds válidos
}
```

#### Doctor
```javascript
{
    name: String,        // OBRIGATÓRIO, não vazio
    specialty: String,   // OBRIGATÓRIO, não vazio
    consultIds: Array    // OPCIONAL, apenas ObjectIds válidos
}
```

#### Consult
```javascript
{
    date: Date,          // OBRIGATÓRIO, formato ISO válido
    shift: String,       // OBRIGATÓRIO, não vazio
    doctorId: ObjectId,  // OBRIGATÓRIO, referência válida
    patientId: ObjectId, // OBRIGATÓRIO, referência válida
    description: String  // OBRIGATÓRIO, não vazio
}
```

#### User
```javascript
{
    name: String,        // OBRIGATÓRIO, não vazio
    email: String,       // OBRIGATÓRIO, formato email válido, único
    passwordHash: String,// OBRIGATÓRIO (nunca expor em responses)
    role: Enum           // OBRIGATÓRIO ['root', 'client', 'doctor', 'employee']
}
```

### 3. Campos Proibidos em Responses

#### ❌ NUNCA Retornar
```javascript
// ❌ ERRADO
{
    passwordHash: "$2a$12$...",  // ❌ NUNCA expor senha
    __v: 0                       // ❌ Evitar versão do Mongoose
}
```

#### ✅ Sanitizar Antes de Retornar
```javascript
// ✅ CORRETO
export async function registerService({ name, email, password, roles }) {
    const user = await createUser({
        name,
        email,
        passwordHash: await bcrypt.hash(password, 12),
        roles
    });
    
    user.passwordHash = undefined;  // ✅ Remove senha
    return { user, token };
}
```

---

## 🔄 Restrições de Relacionamentos

### 1. Integridade Referencial

#### ❌ NÃO PERMITIDO - Criar Sem Verificar Referências
```javascript
// ❌ ERRADO
export async function createConsultService({ date, doctorId, patientId, description, shift }) {
    return await createConsult({ date, doctorId, patientId, description, shift });
    // ❌ Não verifica se doctor e patient existem
}
```

#### ✅ SEMPRE Verificar Referências
```javascript
// ✅ CORRETO
export async function createConsultService({ date, doctorId, patientId, description, shift }) {
    const patientExists = await Patient.findById(patientId).lean();
    if (!patientExists) {
        throw new NotFoundError("Patient not found");
    }

    const doctorExists = await Doctor.findById(doctorId).lean();
    if (!doctorExists) {
        throw new NotFoundError("Doctor not found");
    }

    return await createConsult({ date, doctorId, patientId, description, shift });
}
```

### 2. Sincronização de Arrays de Referências

#### Quando Criar Consulta
```javascript
// ✅ OBRIGATÓRIO - Adicionar aos arrays de Doctor e Patient
await Promise.all([
    updateDoctorById(doctorId, { $push: { consultIds: consult._id } }),
    updatePatientById(patientId, { $push: { consultIds: consult._id } })
]);
```

#### Quando Deletar Consulta
```javascript
// ✅ OBRIGATÓRIO - Remover dos arrays
await Promise.all([
    updateDoctorById(doctorId, { $pull: { consultIds: consultId } }),
    updatePatientById(patientId, { $pull: { consultIds: consultId } })
]);
```

#### Quando Atualizar Consulta (Mudança de Doctor/Patient)
```javascript
// ✅ OBRIGATÓRIO - Remover do antigo, adicionar ao novo
if (currentConsult.doctorId !== newDoctorId) {
    await updateDoctorById(newDoctorId, { $push: { consultIds: consultId } });
    await updateDoctorById(currentConsult.doctorId, { $pull: { consultIds: consultId } });
}
```

---

## 📈 Restrições de Performance

### 1. Paginação Obrigatória em Listagens

#### ❌ NÃO PERMITIDO - Listar Tudo Sem Limite
```javascript
// ❌ ERRADO
export async function getAllPatients() {
    return await Patient.find();  // Pode retornar milhares de registros
}
```

#### ✅ USAR Paginação
```javascript
// ✅ CORRETO
export async function getAllPatients(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await Patient.find().skip(skip).limit(limit);
}
```

### 2. Uso de `.lean()` em Leituras

```javascript
// ✅ PREFERIR - Quando não precisa de métodos do Mongoose
const patient = await Patient.findById(id).lean();  // Retorna objeto JS puro (mais rápido)

// ✅ EVITAR - A menos que precise dos métodos
const patient = await Patient.findById(id);  // Retorna documento Mongoose completo
```

### 3. Select Apenas Campos Necessários

```javascript
// ✅ CORRETO - Select específico
const patients = await Patient.find().select('name age').lean();

// ❌ EVITAR - Trazer tudo quando não precisa
const patients = await Patient.find().lean();
```

---

## 🧪 Restrições de Testes

### 1. Testes de Integração DEVEM

#### ✅ OBRIGATÓRIO em Cada Teste
```javascript
beforeAll(async () => {
    await dbHandler.connect();  // ✅ Conectar ao DB de teste
});

afterEach(async () => {
    await dbHandler.clearDatabase();  // ✅ Limpar após cada teste
});

afterAll(async () => {
    await dbHandler.closeDatabase();  // ✅ Fechar conexão
});
```

#### ❌ NÃO PERMITIDO
- Testes que dependem uns dos outros
- Testes que usam banco de dados de produção
- Testes sem cleanup
- Hardcode de IDs

### 2. Cobertura Mínima

```javascript
// OBRIGATÓRIO testar:
- ✅ Success cases (201, 200, 204)
- ✅ Validation errors (400)
- ✅ Not found errors (404)
- ✅ Authorization errors (401, 403)

// Mínimo de cobertura: 80%
```

---

## 🌍 Restrições de Ambiente

### 1. Variáveis de Ambiente Obrigatórias

```env
# ✅ OBRIGATÓRIO - Deve existir no .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/consultManagement
JWT_SECRET=your_secret_key_here
NODE_ENV=development|test|production
```

#### ❌ NÃO PERMITIDO - Hardcode de Valores Sensíveis
```javascript
// ❌ ERRADO
const JWT_SECRET = 'my-secret-123';
const MONGODB_URI = 'mongodb://localhost:27017/mydb';

// ✅ CORRETO
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
```

### 2. Conexão com MongoDB

#### ❌ NÃO CONECTAR em Ambiente de Teste
```javascript
// ✅ CORRETO - server.js
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI);
}
```

---

## 📦 Restrições de Dependencies

### 1. NÃO Adicionar Dependências Sem Justificativa

#### ❌ NÃO PERMITIDO
- Lodash (usar métodos nativos do JS)
- Moment.js (usar Date nativo ou date-fns se necessário)
- Axios (usar fetch ou existing patterns)

#### ✅ PERMITIDO (já no projeto)
```json
{
  "express": "^4.21.2",
  "mongoose": "^8.11.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^3.0.3",
  "dotenv": "^16.4.7",
  "jest": "^29.7.0",
  "supertest": "^7.0.0"
}
```

---

## 🔒 Restrições de Segurança

### 1. Passwords

#### ❌ NÃO PERMITIDO
```javascript
// ❌ ERRADO - Armazenar senha em texto puro
const user = {
    password: '123456'  // ❌ NUNCA
};
```

#### ✅ OBRIGATÓRIO
```javascript
// ✅ CORRETO - Hash com bcrypt
const salt = await bcrypt.genSalt(12);
const passwordHash = await bcrypt.hash(password, salt);
```

### 2. JWT

#### ❌ NÃO PERMITIDO
```javascript
// ❌ ERRADO - Token sem expiração
const token = jwt.sign(payload, JWT_SECRET);
```

#### ✅ OBRIGATÓRIO
```javascript
// ✅ CORRETO - Token com expiração
const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '8h'
});
```

### 3. Sanitização de Entrada

#### ✅ SEMPRE Validar e Sanitizar
```javascript
// ✅ CORRETO
const name = req.body.name?.trim();
const age = parseInt(req.body.age);

if (typeof name !== 'string' || name === '') {
    throw new ValidationError('Invalid name');
}
```

---

## 🚀 Restrições de Deploy

### 1. Antes de Deploy para Produção

#### ✅ CHECKLIST OBRIGATÓRIO
- [ ] Todos os testes passando
- [ ] Coverage >= 80%
- [ ] Sem console.log
- [ ] Variáveis de ambiente configuradas
- [ ] MongoDB_URI aponta para produção
- [ ] JWT_SECRET forte e único
- [ ] NODE_ENV=production

#### ❌ NÃO PERMITIDO em Produção
- `console.log` (usar logger apropriado)
- Variáveis hardcoded
- MongoDB de desenvolvimento
- Secrets commitados no código

---

**Última atualização**: 25 de novembro de 2025
