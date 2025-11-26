import { v4 as uuidv4 } from 'uuid';
import logger from './logger.js';

export function correlationIdMiddleware(req, res, next) {
  const headerId = req.headers['x-request-id'];
  const id = typeof headerId === 'string' && headerId.trim() !== '' ? headerId : uuidv4();
  req.id = id;
  res.setHeader('x-request-id', id);
  next();
}

export function requestLoggerMiddleware(req, res, next) {
  const start = process.hrtime.bigint();
  const child = logger.child({ reqId: req.id });
  child.debug({ method: req.method, url: req.originalUrl }, 'request:start');

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    child.info({ statusCode: res.statusCode, durationMs }, 'request:finish');
  });

  next();
}
