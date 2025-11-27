# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copia node_modules instalado no estágio anterior
COPY --from=deps /app/node_modules ./node_modules
# Copia código fonte
COPY . .
# Usuário não-root para reduzir riscos
RUN addgroup -S nodegrp && adduser -S nodeusr -G nodegrp
USER nodeusr
EXPOSE 4000
# Healthcheck baseado no endpoint /health
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:4000/health | grep '"status":"ok"' || exit 1
CMD ["node", "server.js"]
