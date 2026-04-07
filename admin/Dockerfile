FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY services/admin/package.json ./services/admin/

RUN npm ci --workspace=@novapay/shared --workspace=@novapay/admin

COPY packages/shared/ ./packages/shared/
COPY services/admin/ ./services/admin/
COPY tsconfig.base.json ./

RUN npm run build --workspace=@novapay/shared
RUN npm run build --workspace=@novapay/admin

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/services/admin/dist ./services/admin/dist
COPY --from=builder /app/services/admin/package.json ./services/admin/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/admin/node_modules ./services/admin/node_modules

USER appuser

EXPOSE 3006

CMD ["node", "services/admin/dist/index.js"]
