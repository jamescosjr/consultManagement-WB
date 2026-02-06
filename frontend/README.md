# Frontend (React + Vite)

Rápido scaffold para o front-end que consome a API do back-end neste repositório.

Run (dentro da pasta `frontend`):

```bash
npm install
npm run dev
```

Configuração
- `VITE_API_BASE` — se a API não rodar no mesmo host, configure um `.env` com `VITE_API_BASE=http://localhost:4000`.

Rotas implementadas (mínimo)
- `/login` — tela de login
- `/root` — dashboard para role `root`
- `/doctor` — dashboard para role `doctor`
- `/client` — dashboard para role `client`

Notas
- Este scaffold é propositalmente simples. Ao integrar com o back-end, os dashboards devem usar endpoints:
  - `POST /auth/login` — autenticação
  - `GET /consults/doctor/:id` — agenda do médico
  - `GET /consults/patient/:id` — consultas do paciente
