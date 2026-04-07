FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/gateway/package.json ./services/gateway/

RUN npm ci --workspace=@novapay/shared --workspace=@novapay/gateway

COPY packages/shared/ ./packages/shared/
COPY services/gateway/ ./services/gateway/
COPY tsconfig.base.json ./

RUN npm run build --workspace=@novapay/shared
RUN npm run build --workspace=@novapay/gateway

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/services/gateway/dist ./services/gateway/dist
COPY --from=builder /app/services/gateway/package.json ./services/gateway/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/gateway/node_modules ./services/gateway/node_modules

USER appuser

EXPOSE 3000

CMD ["node", "services/gateway/dist/index.js"]
