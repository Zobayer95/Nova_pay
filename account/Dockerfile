FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/account/package.json ./services/account/

RUN npm ci --workspace=@novapay/shared --workspace=@novapay/account

COPY packages/shared/ ./packages/shared/
COPY services/account/ ./services/account/
COPY tsconfig.base.json ./

RUN npm run build --workspace=@novapay/shared
RUN npx prisma generate --schema=services/account/prisma/schema.prisma
RUN npm run build --workspace=@novapay/account

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/services/account/dist ./services/account/dist
COPY --from=builder /app/services/account/package.json ./services/account/
COPY --from=builder /app/services/account/prisma ./services/account/prisma
COPY --from=builder /app/services/account/generated ./services/account/generated
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/account/node_modules ./services/account/node_modules

USER appuser

EXPOSE 3001

CMD ["node", "services/account/dist/src/index.js"]
