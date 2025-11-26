import logger from '../../infrastructure/observability/logger.js';

export default function errorHandler(err, req, res, next) {
    const statusCode = err.status || 500;
    const message = err.message || "Internal server error";

    // Logar sempre de forma estruturada
    logger.error({
        errName: err.name,
        statusCode,
        reqId: req?.id,
        stack: process.env.NODE_ENV === 'test' ? undefined : err.stack,
    }, 'unhandled_error');

    res.status(statusCode).json({ message });
    // Do not propagate after responding to avoid double handling
}