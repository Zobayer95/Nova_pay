FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/transaction/package.json ./services/transaction/

RUN npm ci --workspace=@novapay/shared --workspace=@novapay/transaction

COPY packages/shared/ ./packages/shared/
COPY services/transaction/ ./services/transaction/
COPY tsconfig.base.json ./

RUN npm run build --workspace=@novapay/shared
RUN npx prisma generate --schema=services/transaction/prisma/schema.prisma
RUN npm run build --workspace=@novapay/transaction

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/services/transaction/dist ./services/transaction/dist
COPY --from=builder /app/services/transaction/package.json ./services/transaction/
COPY --from=builder /app/services/transaction/prisma ./services/transaction/prisma
COPY --from=builder /app/services/transaction/generated ./services/transaction/generated
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/transaction/node_modules ./services/transaction/node_modules

USER appuser

EXPOSE 3002

CMD ["node", "services/transaction/dist/src/index.js"]
