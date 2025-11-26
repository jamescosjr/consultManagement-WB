# Stack de Observabilidade - consultManagement-WB

Stack completo com os **3 pilares de observabilidade**: Métricas, Logs e Traces (Distributed Tracing).

## 🏗️ Arquitetura

```
┌─────────────────────┐
│   Node.js API       │  (porta 3000)
│  consultManagement  │
└─────────┬───────────┘
          │
          ├─► /metrics  ──────────► Prometheus (9090)
          │                              │
          ├─► OTLP HTTP (4318) ──► OTel Collector (4317/4318)
          │                              │
          └─► stdout logs ─────────► Promtail ──► Loki (3100)
                                          │
                                          └──► Tempo (3200)

                     Grafana (3001) ◄──── Prometheus, Loki, Tempo
```

## 📦 Serviços

| Serviço            | Porta(s)         | Descrição                                          |
|--------------------|------------------|----------------------------------------------------|
| **Prometheus**     | 9090             | Coleta e armazena métricas via scrape `/metrics`   |
| **Grafana**        | 3001             | Dashboards de métricas, logs e traces              |
| **Tempo**          | 3200, 14317/8    | Backend de distributed tracing (OTLP)              |
| **Loki**           | 3100             | Agregação e query de logs                          |
| **Promtail**       | -                | Coleta logs de containers Docker                   |
| **OTel Collector** | 4317 (gRPC), 4318 (HTTP) | Recebe traces OTLP e exporta para Tempo |

## 🚀 Como usar

### 1. Subir o stack

```bash
cd ~/Documents/WS/consultManagement-WB/ops
sudo docker-compose up -d
```

### 2. Verificar status

```bash
sudo docker-compose ps
```

Todos os containers devem estar `Up`.

### 3. Acessar UIs

- **Grafana**: http://localhost:3001
  - Login padrão: `admin` / `admin`
  - Datasources já provisionados: Prometheus, Tempo, Loki
  - Dashboard preconfigurado: "Node API Overview"

- **Prometheus**: http://localhost:9090
  - Target `consultManagement-WB` deve estar `UP`
  - Query exemplo: `rate(http_request_duration_seconds_count[1m])`

- **Tempo**: http://localhost:3200
  - UI básica para busca de traces

### 4. Parar o stack

```bash
cd ~/Documents/WS/consultManagement-WB/ops
sudo docker-compose down
```

## 🔍 Validação

### Verificar saúde dos serviços

```bash
curl http://localhost:9090/-/ready    # Prometheus
curl http://localhost:3001/api/health  # Grafana
curl http://localhost:3100/ready       # Loki
curl http://localhost:3200/ready       # Tempo
```

### Verificar scrape do Prometheus

```bash
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | select(.job=="consultManagement-WB")'
```

Deve retornar `"health": "up"`.

### Testar traces (após gerar tráfego no app)

1. Acesse http://localhost:3001
2. Vá em **Explore** → selecione datasource **Tempo**
3. Busque por service: `consultManagement-WB`

### Testar logs (Loki + Promtail)

1. Acesse http://localhost:3001
2. Vá em **Explore** → selecione datasource **Loki**
3. Query: `{job="docker-logs"}`

## ⚙️ Configuração do App

No arquivo `.env` do projeto:

```env
# Ativa tracing via OTLP HTTP para o OTel Collector
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318

# Nome do serviço (aparece em traces e métricas)
SERVICE_NAME=consultManagement-WB

# Nível de logs (debug, info, warn, error)
LOG_LEVEL=info
```

### Endpoints expostos pelo app

- `GET /health` - Healthcheck (status, uptime)
- `GET /metrics` - Métricas Prometheus

## 📊 Dashboards do Grafana

### Dashboard preconfigurado: "Node API Overview"

Painéis disponíveis:
- Request Rate (req/s)
- Response Time p95
- Error Rate
- Process Memory

**Localização**: Grafana → Dashboards → Node API Overview

## 🐛 Troubleshooting

### OTel Collector não inicia

```bash
sudo docker logs observability-otel-collector
```

Verifique se a config em `ops/otel-collector/config.yaml` está válida.

### Prometheus não scrape o app

- Confirme que o app está rodando em `http://localhost:3000/metrics`
- No Linux, o `host.docker.internal` é mapeado via `extra_hosts` no compose

### Loki/Tempo retornam "not ready"

Ambos têm um warm-up de 15s. Aguarde e teste novamente:

```bash
curl http://localhost:3100/ready
curl http://localhost:3200/ready
```

### Sem traces no Tempo

1. Verifique se `OTEL_EXPORTER_OTLP_ENDPOINT` está configurado no `.env`
2. Reinicie o app: `npm run dev`
3. Gere tráfego (faça requests na API)
4. Aguarde ~30s e busque no Grafana Explore → Tempo

## 📂 Estrutura de arquivos

```
ops/
├── docker-compose.yml          # Orquestração de todos os serviços
├── prometheus/
│   └── prometheus.yml          # Config do Prometheus (scrape targets)
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── datasource.yml  # Datasources: Prometheus, Tempo, Loki
│   │   └── dashboards/
│   │       └── dashboards.yml  # Provisioning de dashboards
│   └── dashboards/
│       └── node_api_overview.json  # Dashboard principal
├── tempo/
│   └── config.yaml             # Config do Tempo (storage local)
├── loki/
│   └── config.yaml             # Config do Loki (storage local, retention 48h)
├── promtail/
│   └── config.yml              # Config do Promtail (coleta logs Docker)
└── otel-collector/
    └── config.yaml             # Config do Collector (OTLP → Tempo)
```

## 🎯 Próximos passos (opcional)

- [ ] Adicionar alertas no Prometheus (AlertManager)
- [ ] Configurar retenção de dados (Prometheus/Loki/Tempo)
- [ ] Adicionar painéis de logs correlacionados com traces
- [ ] Exportar métricas de negócio customizadas
- [ ] Configurar persistent volumes para dados
- [ ] Setup de produção com backends S3/GCS

## 📚 Referências

- [Prometheus](https://prometheus.io/docs/)
- [Grafana](https://grafana.com/docs/)
- [Grafana Tempo](https://grafana.com/docs/tempo/latest/)
- [Grafana Loki](https://grafana.com/docs/loki/latest/)
- [OpenTelemetry](https://opentelemetry.io/docs/)
