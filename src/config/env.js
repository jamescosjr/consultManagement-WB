/**
 * Configurações centralizadas do ambiente
 * Este módulo garante que todos os componentes usem os mesmos valores
 */

export const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
export const SERVICE_NAME = process.env.SERVICE_NAME || 'consultManagement-WB';
export const OTEL_EXPORTER_OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || '';

