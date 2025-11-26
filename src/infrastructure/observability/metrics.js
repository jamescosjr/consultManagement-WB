import client from 'prom-client';
import { NODE_ENV, SERVICE_NAME } from '../../config/env.js';

const register = new client.Registry();
register.setDefaultLabels({ service: SERVICE_NAME });
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duração das requisições HTTP em ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2000, 5000],
});

register.registerMetric(httpRequestDuration);

export function metricsMiddleware(req, res, next) {
  // Evitar coletar /metrics e /health para não enviesar
  const skip = req.path === '/metrics' || req.path === '/health';
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    if (skip) return;
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    const route = req.route?.path || req.path || 'unmatched';
    httpRequestDuration
      .labels(req.method, route, String(res.statusCode))
      .observe(durationMs);
  });
  next();
}

export async function metricsHandler(req, res) {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}

export { register };
