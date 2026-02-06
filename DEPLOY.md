# Deploy (local / staging / production)

Este arquivo descreve passos básicos para deploy e variáveis de ambiente necessárias.

Variáveis de ambiente essenciais
-- `PORT` — porta onde a API irá escutar (padrão do projeto: 6000 no README).
- `MONGODB_URI` — URI de conexão com MongoDB.
- `JWT_SECRET` — segredo para assinatura dos tokens JWT.
- `NODE_ENV` — `production|development|test`.
- `SERVICE_NAME` — nome do serviço para logs/tracing.
- `OTEL_EXPORTER_OTLP_ENDPOINT` — (opcional) endpoint OTLP para tracing.

Docker (exemplo)
1. Construir imagem:
   ```bash
   docker build -t consult-management:latest .
   ```
2. Rodar com MongoDB (exemplo simples):
   ```bash
   docker run -d --name mongodb -p 27017:27017 mongo
   docker run -d --name consult-api -p 6000:6000 \
      -e MONGODB_URI=mongodb://host.docker.internal:27017/consultManagement \
      -e JWT_SECRET=${JWT_SECRET} \
      consult-management:latest
   ```

Docker Compose
- O repositório já inclui `ops/docker-compose.yml`. Use-o como referência para ambiente com Prometheus, Grafana e observability.

Procedimento para produção
- Garanta que `NODE_ENV=production` e `JWT_SECRET` forte.
- Use um cluster de MongoDB gerenciado (Atlas ou replica set).
- Configure logs e tracing (OTEL) para sua infraestrutura.
- Exponha apenas portas necessárias e proteja com firewall / reverse proxy (NGINX, Traefik).

Blue/Green / Rolling
- Use orquestrador (Kubernetes) para deploy sem downtime.

Rollback
- Mantenha tags de imagens claras e rollback via CI/CD quando necessário.

Health checks
- Verifique `/health` periodicamente (status e uptime).
- Exponha `/metrics` para Prometheus (coleta de métricas).
