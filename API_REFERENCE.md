# API Reference - Consult Management API

## 📚 Endpoints Disponíveis

### Base URL
```
http://localhost:4000
```

---

## 🔐 Autenticação

### Registrar Usuário
```http
POST /auth/register
```

**Body**:
```json
{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "role": "client"
}
```

**Response** (201):
```json
{
    "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "João Silva",
        "email": "joao@example.com",
        "role": "client"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```http
POST /auth/login
```

**Body**:
```json
{
    "email": "joao@example.com",
    "password": "senha123"
}
```

**Response** (200):
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "João Silva",
        "role": "client"
    }
}
```

---

## 👤 Patients (Pacientes)

### Criar Paciente
```http
POST /patients
Authorization: Bearer {token}
```

**Body**:
```json
{
    "name": "Maria Santos",
    "age": 35
}
```

**Response** (201):
```json
{
    "_id": "507f1f77bcf86cd799439011",
    "name": "Maria Santos",
    "age": 35,
    "consultIds": [],
    "__v": 0
}
```

### Listar Todos os Pacientes
```http
GET /patients
Authorization: Bearer {token}
```

**Response** (200):
```json
[
    {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Maria Santos",
        "age": 35,
        "consultIds": []
    },
    {
        "_id": "507f1f77bcf86cd799439012",
        "name": "João Silva",
        "age": 42,
        "consultIds": ["607f1f77bcf86cd799439013"]
    }
]
```

### Buscar Paciente por ID
```http
GET /patients/id/{id}
Authorization: Bearer {token}
```

**Response** (200):
```json
{
    "_id": "507f1f77bcf86cd799439011",
    "name": "Maria Santos",
    "age": 35,
    "consultIds": []
}
```

**Response** (404):
```json
{
    "message": "Patient not found"
}
```

### Buscar Paciente por Nome
```http
GET /patients/name/{name}
Authorization: Bearer {token}
```

**Response** (200):
```json
[
    {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Maria Santos",
        "age": 35,
        "consultIds": []
    }
]
```

### Buscar Pacientes por Idade
```http
GET /patients/age/{age}
Authorization: Bearer {token}
```

**Response** (200):
```json
[
    {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Maria Santos",
        "age": 35,
        "consultIds": []
    },
    {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Pedro Costa",
        "age": 35,
        "consultIds": []
    }
]
```

### Atualizar Paciente
```http
PUT /patients/{id}
Authorization: Bearer {token}
```

**Body**:
```json
{
    "name": "Maria Santos Silva",
    "age": 36
}
```

**Response** (200):
```json
{
    "_id": "507f1f77bcf86cd799439011",
    "name": "Maria Santos Silva",
    "age": 36,
    "consultIds": []
}
```

### Deletar Paciente
```http
DELETE /patients/{id}
Authorization: Bearer {token}
Roles: root, employee
```

**Response** (204): No Content

---

## 👨‍⚕️ Doctors (Médicos)

### Criar Médico
```http
POST /doctors
Authorization: Bearer {token}
```

**Body**:
```json
{
    "name": "Dr. Carlos Mendes",
    "specialty": "Cardiologia"
}
```

**Response** (201):
```json
{
    "_id": "507f1f77bcf86cd799439021",
    "name": "Dr. Carlos Mendes",
    "specialty": "Cardiologia",
    "consultIds": [],
    "__v": 0
}
```

### Listar Todos os Médicos
```http
GET /doctors
Authorization: Bearer {token}
```

**Response** (200):
```json
[
    {
        "_id": "507f1f77bcf86cd799439021",
        "name": "Dr. Carlos Mendes",
        "specialty": "Cardiologia",
        "consultIds": []
    }
]
```

### Buscar Médico por ID
```http
GET /doctors/id/{id}
Authorization: Bearer {token}
```

**Response** (200):
```json
{
    "_id": "507f1f77bcf86cd799439021",
    "name": "Dr. Carlos Mendes",
    "specialty": "Cardiologia",
    "consultIds": ["607f1f77bcf86cd799439031"]
}
```

### Buscar Médico por Nome
```http
GET /doctors/name/{name}
Authorization: Bearer {token}
```

**Response** (200):
```json
[
    {
        "_id": "507f1f77bcf86cd799439021",
        "name": "Dr. Carlos Mendes",
        "specialty": "Cardiologia",
        "consultIds": []
    }
]
```

### Buscar Médicos por Especialidade
```http
GET /doctors/specialty/{specialty}
Authorization: Bearer {token}
```

**Response** (200):
```json
[
    {
        "_id": "507f1f77bcf86cd799439021",
        "name": "Dr. Carlos Mendes",
        "specialty": "Cardiologia",
        "consultIds": []
    },
    {
        "_id": "507f1f77bcf86cd799439022",
        "name": "Dra. Ana Paula",
        "specialty": "Cardiologia",
        "consultIds": []
    }
]
```

### Atualizar Médico
```http
PUT /doctors/{id}
Authorization: Bearer {token}
```

**Body**:
```json
{
    "name": "Dr. Carlos Mendes Jr.",
    "specialty": "Cardiologia Pediátrica"
}
```

**Response** (200):
```json
{
    "_id": "507f1f77bcf86cd799439021",
    "name": "Dr. Carlos Mendes Jr.",
    "specialty": "Cardiologia Pediátrica",
    "consultIds": []
}
```

### Deletar Médico
```http
DELETE /doctors/{id}
Authorization: Bearer {token}
Roles: root, employee
```

**Response** (204): No Content

---

## 📅 Consults (Consultas)

### Criar Consulta
```http
POST /consults
Authorization: Bearer {token}
```

**Body**:
```json
{
    "date": "2025-12-01T10:00:00.000Z",
    "shift": "morning",
    "doctorId": "507f1f77bcf86cd799439021",
    "patientId": "507f1f77bcf86cd799439011",
    "description": "Consulta de rotina"
}
```

**Response** (201):
```json
{
    "_id": "607f1f77bcf86cd799439031",
    "date": "2025-12-01T10:00:00.000Z",
    "shift": "morning",
    "doctorId": "507f1f77bcf86cd799439021",
    "patientId": "507f1f77bcf86cd799439011",
    "description": "Consulta de rotina",
    "__v": 0
}
```

**Response** (404):
```json
{
    "message": "Patient not found"
}
```
ou
```json
{
    "message": "Doctor not found"
}
```

### Listar Todas as Consultas
```http
GET /consults
Authorization: Bearer {token}
```

**Response** (200):
```json
[
    {
        "_id": "607f1f77bcf86cd799439031",
        "date": "2025-12-01T10:00:00.000Z",
        "shift": "morning",
        "doctorId": "507f1f77bcf86cd799439021",
        "patientId": "507f1f77bcf86cd799439011",
        "description": "Consulta de rotina"
    }
]
```

### Buscar Consulta por ID
```http
GET /consults/id/{id}
Authorization: Bearer {token}
```

**Response** (200):
```json
{
    "_id": "607f1f77bcf86cd799439031",
    "date": "2025-12-01T10:00:00.000Z",
    "shift": "morning",
    "doctorId": "507f1f77bcf86cd799439021",
    "patientId": "507f1f77bcf86cd799439011",
    "description": "Consulta de rotina"
}
```

### Buscar Consultas por Médico
```http
GET /consults/doctor/{doctorId}
Authorization: Bearer {token}
```

**Response** (200):
```json
[
    {
        "_id": "607f1f77bcf86cd799439031",
        "date": "2025-12-01T10:00:00.000Z",
        "shift": "morning",
        "doctorId": "507f1f77bcf86cd799439021",
        "patientId": "507f1f77bcf86cd799439011",
        "description": "Consulta de rotina"
    }
]
```

### Buscar Consultas por Paciente
```http
GET /consults/patient/{patientId}
Authorization: Bearer {token}
```

**Response** (200):
```json
[
    {
        "_id": "607f1f77bcf86cd799439031",
        "date": "2025-12-01T10:00:00.000Z",
        "shift": "morning",
        "doctorId": "507f1f77bcf86cd799439021",
        "patientId": "507f1f77bcf86cd799439011",
        "description": "Consulta de rotina"
    }
]
```

### Buscar Consultas por Data
```http
GET /consults/date/{date}
Authorization: Bearer {token}
```

**Exemplo**: `GET /consults/date/2025-12-01`

**Response** (200):
```json
[
    {
        "_id": "607f1f77bcf86cd799439031",
        "date": "2025-12-01T10:00:00.000Z",
        "shift": "morning",
        "doctorId": "507f1f77bcf86cd799439021",
        "patientId": "507f1f77bcf86cd799439011",
        "description": "Consulta de rotina"
    }
]
```

### Atualizar Consulta
```http
PUT /consults/{id}
Authorization: Bearer {token}
```

**Body**:
```json
{
    "date": "2025-12-02T14:00:00.000Z",
    "shift": "afternoon",
    "doctorId": "507f1f77bcf86cd799439021",
    "patientId": "507f1f77bcf86cd799439011",
    "description": "Consulta de retorno"
}
```

**Response** (200):
```json
{
    "_id": "607f1f77bcf86cd799439031",
    "date": "2025-12-02T14:00:00.000Z",
    "shift": "afternoon",
    "doctorId": "507f1f77bcf86cd799439021",
    "patientId": "507f1f77bcf86cd799439011",
    "description": "Consulta de retorno"
}
```

### Deletar Consulta
```http
DELETE /consults/{id}
Authorization: Bearer {token}
Roles: root, employee, doctor
```

**Response** (204): No Content

---

## 🔒 Códigos de Status HTTP

| Código | Significado | Quando Usar |
|--------|-------------|-------------|
| 200 | OK | GET, PUT bem-sucedidos |
| 201 | Created | POST bem-sucedido |
| 204 | No Content | DELETE bem-sucedido |
| 400 | Bad Request | Validação falhou |
| 401 | Unauthorized | Token ausente/inválido |
| 403 | Forbidden | Sem permissão (role) |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro do servidor |

---

## 🔑 Headers de Autenticação

Para rotas protegidas, incluir header:
```
Authorization: Bearer {token}
```

Exemplo:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDU...
```

---

## 🎭 Roles e Permissões

| Role | Permissões |
|------|------------|
| `root` | Acesso total a todas as rotas |
| `employee` | CRUD em patients, doctors, consults |
| `doctor` | CRUD em consults, Read em patients |
| `client` | Read em próprio perfil e consultas |

---

## ❌ Exemplos de Erros

### Validação
```json
{
    "message": "The name should be a valid string"
}
```

### Não Encontrado
```json
{
    "message": "Patient not found"
}
```

### Não Autorizado
```json
{
    "message": "Token não fornecido"
}
```

### Sem Permissão
```json
{
    "message": "Acesso negado. Permissão insuficiente."
}
```

### Token Inválido
```json
{
    "message": "Token inválido ou expirado"
}
```

---

**Última atualização**: 25 de novembro de 2025
