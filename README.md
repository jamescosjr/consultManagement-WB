# Consult Management API

## Overview
The **Consult Management API** is a RESTful API designed to facilitate the management of medical consultations. It allows users to create, retrieve, update, and delete consultations, doctors, and patients.

Built with **Node.js**, **Express**, **MongoDB** and following **Clean Architecture** principles.

## 📚 Documentation

For detailed information about the project, please refer to:

- **[AGENT.md](./AGENT.md)** - Complete development guide and architecture rules
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide for developers
- **[CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md)** - Code style and conventions
- **[RESTRICTIONS.md](./RESTRICTIONS.md)** - Architecture restrictions and limitations
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API reference

## Features
- 🔐 JWT Authentication and Role-based Authorization
- 👤 User management with different roles (root, employee, doctor, client)
- 👨‍⚕️ Doctor management with specialties
- 🏥 Patient management
- 📅 Medical consultation scheduling and management
- 🔍 Advanced search by date, doctor, patient, specialty
- ✅ Comprehensive input validation
- 🧪 Full test coverage with Jest
- 🏗️ Clean Architecture with DDD principles

## Installation

### Prerequisites
- Node.js (>=16.x)
- MongoDB
- npm or yarn

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/jamescosjr/consultManagement-WB.git
   ```
2. Navigate to the project directory:
   ```sh
   cd consultManagement-WB
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up the environment variables in a `.env` file (updated default port = 6000):
   ```env
   PORT=6000
   MONGODB_URI=mongodb://localhost:27017/consultManagement
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   SERVICE_NAME=consultManagement-WB
   # Host port mapped to OTLP HTTP (4318 in container -> 4320 on host)
   OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4320
   ```
5. Start MongoDB:
   ```sh
   # With Docker
   docker run -d -p 27017:27017 --name mongodb mongo
   
   # Or start local MongoDB
   mongod
   ```
6. Start the server:
   ```sh
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```
   Note: The server will run on `server.js` which imports from the src directory.
7. Run tests:
   ```sh
   npm test
   ```

## 🏗️ Architecture

This project follows Clean Architecture principles with three main layers:

```
src/
├── __tests__/        # Integration tests
├── application/      # Controllers, Routes, Middleware
├── domain/          # Business Logic, Services, Validations
├── infrastructure/  # Database, Schemas, Repositories
└── test-helpers/    # Test utilities and helpers
```

For detailed architecture information, see [AGENT.md](./AGENT.md).

## API Documentation

For complete API documentation with examples, see [API_REFERENCE.md](./API_REFERENCE.md).

### Quick Overview

#### Authentication
- **POST** `/auth/register` - Register new user

#### Consultations
- **POST** `/consults` - Create a new consultation
- **GET** `/consults` - Retrieve all consultations
- **GET** `/consults/id/{id}` - Get a consultation by ID
- **PUT** `/consults/{id}` - Update a consultation
- **DELETE** `/consults/{id}` - Delete a consultation
- **GET** `/consults/doctor/{doctorId}` - Get consultations by doctor
- **GET** `/consults/patient/{patientId}` - Get consultations by patient
- **GET** `/consults/date/{date}` - Get consultations by date

#### Patients
- **POST** `/patients` - Create a new patient
- **GET** `/patients` - Retrieve all patients
- **GET** `/patients/id/{id}` - Get a patient by ID
- **PUT** `/patients/{id}` - Update a patient
- **DELETE** `/patients/{id}` - Delete a patient
- **GET** `/patients/name/{name}` - Get a patient by name
- **GET** `/patients/age/{age}` - Get patients by age

#### Doctors
- **POST** `/doctors` - Create a new doctor
- **GET** `/doctors` - Retrieve all doctors
- **GET** `/doctors/id/{id}` - Get a doctor by ID
- **PUT** `/doctors/{id}` - Update a doctor
- **DELETE** `/doctors/{id}` - Delete a doctor
- **GET** `/doctors/name/{name}` - Get a doctor by name
- **GET** `/doctors/specialty/{specialty}` - Get doctors by specialty

#### Users
- **GET** `/users` - Retrieve all users (with pagination)
- **GET** `/users/id/{id}` - Get a user by ID
- **GET** `/users/name/{name}` - Get users by name (with pagination)
- **GET** `/users/email/{email}` - Get a user by email
- **GET** `/users/role/{role}` - Get users by role (with pagination)
- **PUT** `/users/{id}` - Update a user
- **PUT** `/users/{id}/password` - Change user password
- **DELETE** `/users/{id}` - Delete a user

### Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

### Roles & Segurança

- `root`: Full access to all endpoints. **Apenas `root` deve poder criar, atualizar ou deletar outros usuários** — em produção a rota de registro pública deve ser desativada ou protegida.
- `employee`: CRUD access to patients, doctors, and consultations
- `doctor`: CRUD access to consultations, read access to patients
- `client`: Read access to own profile and consultations

Segurança recomendada:
- Nunca exponha `JWT_SECRET` em repositórios. Use segredos gerenciados no ambiente de produção.
- Sempre use HTTPS em produção e configure CORS/CSRF conforme necessário.
- Senhas devem ser armazenadas apenas após hashing (o projeto usa `bcryptjs`).
- Tokens JWT devem ser curtos e renováveis; armazene tokens no cliente com segurança.

## 🧪 Testing

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm test -- --watch
```

The project uses Jest for testing with MongoDB Memory Server for integration tests.

## 🔌 Ports & Observability

The `docker-compose` (in `ops/docker-compose.yml`) maps the following service ports:

| Service            | Host Port | Container Port | Notes |
|--------------------|-----------|----------------|-------|
| API (Express)      | 6000      | 6000           | REST endpoints, `/health`, `/metrics` |
| Prometheus         | 9090      | 9090           | Metrics UI |
| Grafana            | 3005      | 3000           | Dashboards (custom host port) |
| Tempo (Traces)     | 3200      | 3200           | Trace query/UI |
| Loki (Logs)        | 3101      | 3101           | Log queries |
| OTEL Collector     | 4320      | 4318           | OTLP HTTP ingest |

### API Endpoints (Local)

- Health check: `curl http://127.0.0.1:6000/health`
- Metrics (Prometheus format): `curl http://127.0.0.1:6000/metrics | head`

### Updating Existing Docs

If you previously used port `3000`, update any scripts, reverse proxies, or monitoring configs to target `6000` instead. The sample `.env` and this README now reflect the new default.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Read [AGENT.md](./AGENT.md) for architecture guidelines
2. Follow [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md)
3. Respect [RESTRICTIONS.md](./RESTRICTIONS.md)
4. Write tests for new features
5. Ensure all tests pass
6. Use conventional commits

### Commit Convention
```
feat: add new feature
fix: fix bug
docs: update documentation
test: add/update tests
refactor: refactor code
style: formatting
chore: maintenance
```

## 📄 License
This project is licensed under the MIT License.

## 📧 Contact
For any questions, reach out via:
- **GitHub**: [jamescosjr](https://github.com/jamescosjr)
- **Repository**: [consultManagement-WB](https://github.com/jamescosjr/consultManagement-WB)

---

**Made with ❤️ by James**
