import dotenv from "dotenv";

// Configure environment variables BEFORE other imports
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import routes from "./src/application/router/routes.js";
import errorHandler from "./src/application/middleware/errorHandler.js";
import { validate } from 'express-jsonschema';
import yaml from 'js-yaml';
import fs from 'fs';
import { correlationIdMiddleware, requestLoggerMiddleware } from './src/infrastructure/observability/httpLogger.js';
import logger from './src/infrastructure/observability/logger.js';
import { metricsMiddleware, metricsHandler } from './src/infrastructure/observability/metrics.js';
import { initTracing } from './src/infrastructure/observability/tracing.js';

const schema = yaml.load(fs.readFileSync('./src/application/contracts/contract.yaml', 'utf8'));


// Inicializa tracing se configurado (não bloqueante)
initTracing();

export const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Observability middlewares (ordem importa)
app.use(correlationIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(metricsMiddleware);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, {});

  mongoose.connection.on("open", () => {
    logger.info("Connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    logger.error({ err }, "Error connecting to MongoDB");
  });
}

const validateSchema = (req, res, next) => {
  const validation = validate({ body: schema });
  validation(req, res, next);
};

app.use(validateSchema);

// Health e métricas
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});
app.get('/metrics', metricsHandler);

app.use(routes);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info({ port: PORT }, `App listening on port ${PORT}`);
  });
}