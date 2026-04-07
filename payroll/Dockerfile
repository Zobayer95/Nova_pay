FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/
COPY services/payroll/package.json services/payroll/

RUN npm ci --workspace=services/payroll --workspace=packages/shared

COPY packages/shared/ packages/shared/
COPY services/payroll/ services/payroll/
COPY tsconfig.base.json ./

RUN npm run build --workspace=packages/shared
RUN npx prisma generate --schema=services/payroll/prisma/schema.prisma
RUN npm run build --workspace=services/payroll

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/packages/shared/package.json packages/shared/
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/services/payroll/package.json services/payroll/
COPY --from=builder /app/services/payroll/dist services/payroll/dist
COPY --from=builder /app/services/payroll/prisma services/payroll/prisma
COPY --from=builder /app/services/payroll/generated services/payroll/generated
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/services/payroll/node_modules services/payroll/node_modules

EXPOSE 3005

CMD ["node", "services/payroll/dist/src/index.js"]
