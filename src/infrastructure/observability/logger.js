import pino from 'pino';
import { LOG_LEVEL, SERVICE_NAME } from '../../config/env.js';

const logger = pino({
  name: SERVICE_NAME,
  level: LOG_LEVEL,
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime
});

export default logger;

export function getRequestLogger(req) {
  const reqId = req.id || req.headers['x-request-id'];
  return logger.child({ reqId });
}
