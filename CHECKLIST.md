# Checklist rápida - Preparar front-end e contribuições

Desenvolvimento local
- [ ] Clonar o repositório
- [ ] Criar `.env` com variáveis mínimas: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV` e `SERVICE_NAME`.
- [ ] Instalar dependências: `npm install`.
- [ ] Iniciar MongoDB (local ou via Docker).
- [ ] Rodar em modo dev: `npm run dev`.

Testes
- [ ] Rodar testes: `npm test` (usa mongodb-memory-server).
- [ ] Cobertura: revisar `coverage/lcov-report/index.html`.

Documentação e estilo
- [ ] Seguir `CODE_STYLE.md` para novo código.
- [ ] Atualizar `API_REFERENCE.md` ao adicionar endpoints.

Front-end (entregáveis mínimos)
- [ ] Tela de Login (POST `/auth/login`) — salvar token no storage seguro.
- [ ] Dashboard `root` — visão geral, CRUD de consults, doctors, patients, users.
- [ ] Dashboard `doctor` — visualizar própria agenda, filtrar por data, solicitar mudanças.
- [ ] Dashboard `client` — visualizar consultas próprias, solicitar remarcação/cancelamento.
- [ ] Implementar proteção de rotas e redirecionamento por `role`.

Deploy / Infra
- [ ] Configurar `MONGODB_URI` em ambiente de produção.
- [ ] Expor porta correta (padrão do projeto: `4000`).
- [ ] Garantir variáveis OTEL se for usar tracing (opcional).

Fluxo de solicitações (workflow adicional)
- [ ] Definir como `doctor`/`client` abrirão solicitações (ex: endpoint `POST /requests` ou uso de campos em `consults`).
- [ ] Implementar notificação/registro das solicitações para `root` revisar.
