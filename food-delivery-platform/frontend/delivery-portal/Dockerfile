# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS production

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Security: add dumb-init
RUN apk --no-cache add dumb-init

WORKDIR /app
ENV NODE_ENV production

# Copy Next.js standalone build output
COPY --from=build --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=build --chown=appuser:appgroup /app/.next/static ./.next/static

# Security: own files by non-root user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000
ENV PORT 3000

# Security: use dumb-init for proper signal handling (PID 1 problem)
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
