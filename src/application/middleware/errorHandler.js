export default function errorHandler(err, req, res, next) {

    const statusCode = err.status || 500;
    const message = err.message || "Internal server error";
    if (process.env.NODE_ENV === 'test') {
        // Helpful logging during tests to diagnose unexpected 500s
        // eslint-disable-next-line no-console
        console.error('ErrorHandler caught:', { statusCode, message, name: err.name, stack: err.stack });
    }

    res.status(statusCode).json({ message });
    // Do not propagate after responding to avoid double handling
}