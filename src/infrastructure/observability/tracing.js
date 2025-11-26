import { NODE_ENV, OTEL_EXPORTER_OTLP_ENDPOINT, SERVICE_NAME } from '../../config/env.js';
import logger from './logger.js';

let started = false;

export async function initTracing() {
  try {
    if (started) return;
    if (NODE_ENV === 'test') return; // não inicializa em testes
    if (!OTEL_EXPORTER_OTLP_ENDPOINT) return; // só ativa se houver endpoint

    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const { Resource } = await import('@opentelemetry/resources');
    const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');

    const traceExporter = new OTLPTraceExporter({
      url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
    });

    const sdk = new NodeSDK({
      traceExporter,
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    await sdk.start();
    started = true;

    process.on('SIGTERM', async () => {
      try { await sdk.shutdown(); } catch { /* noop */ }
    });
    process.on('SIGINT', async () => {
      try { await sdk.shutdown(); } catch { /* noop */ }
    });
  } catch (err) {
    // Tracing não deve derrubar a aplicação
    logger.error({ err }, 'Falha ao inicializar tracing');
  }
}
