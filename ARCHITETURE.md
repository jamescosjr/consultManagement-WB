# Arquitetura - Consult Management API

Resumo da arquitetura adotada neste repositório.

Princípios
- Clean Architecture / DDD: separação entre `application`, `domain` e `infrastructure`.
- Responsabilidade única por camada: controllers tratam HTTP, services implementam regras de negócio, repositories fazem persistência.

Estrutura principal (src)
- `src/application/` — controllers, rotas, middlewares, contratos (YAML).
- `src/domain/` — serviços de domínio, validações e erros personalizados.
- `src/infrastructure/` — schemas Mongoose, repositórios, observability (logger, tracing, metrics).
- `src/__tests__/` — testes de integração usando Jest e mongodb-memory-server.

Autenticação e autorização
- JWT usado para autenticação (`jsonwebtoken`).
- Roles identificadas no código: `root`, `doctor`, `client` (há menções a `employee` em docs).
- Cabe ao middleware de autenticação autorizar acesso baseado em `role` presente no token.

APIs relevantes para front-end
- `POST /auth/login` — autenticação, retorna token e `user` com `role` e `roleDetails`.
- `GET /users/role/:role` — listar usuários por role (paginação disponível `?page=&limit=`).
- `GET /consults/doctor/:doctorId` — consultar agenda do médico.
- `GET /consults/patient/:patientId` — consultar consultas do paciente.
- `POST|PUT|DELETE /consults` — CRUD de consultas (protegido por roles).

Observability
- Métricas: `/metrics` (Prometheus).
- Health check: `/health`.
- Tracing, logs e correlation id implementados na camada de infraestrutura.

Notas para evolução do front-end
- Telas necessárias: Login, Dashboard por role (Root: gestão completa; Doctor: visualizar/filtrar agenda; Client: visualizar próprias consultas), pedidos de alteração (workflow de solicitações ao `root`).
- Autorização: front-end deve armazenar token e enviar `Authorization: Bearer {token}`.
- Paginação e filtros já suportados nas rotas; implemente componentes de paginação.

Segurança e regras de acesso
- Dados sensíveis (senhas, tokens) devem ser tratados com cuidado: senhas são armazenadas hashed (`bcryptjs`) e tokens JWT nunca devem ser expostos em repositórios.
- Regra operacional crítica: **apenas o usuário com role `root` pode criar, atualizar ou deletar outros usuários**. `doctor` e `client` só podem ver suas próprias consultas/agenda e abrir solicitações para mudanças que o `root` aprovará.
- Em produção considere desabilitar registro público (`/auth/register`) e provisionar usuários via processos administrativos ou endpoints protegidos por `root`.
