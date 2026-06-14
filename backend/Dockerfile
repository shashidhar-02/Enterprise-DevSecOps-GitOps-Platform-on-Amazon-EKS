# ==============================================================
# CraveDrop Backend - Production Dockerfile
# ==============================================================

# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# ---- Production stage ----
FROM node:20-alpine AS production

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Security: remove unnecessary packages and add dumb-init
# hadolint ignore=DL3018
RUN apk add --no-cache your-package-name

WORKDIR /app

# Copy only production dependencies from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy source code
COPY src/ ./src/
# Copy package.json so the app knows its own metadata if needed
COPY package.json ./

# Security: own files by non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose backend API port
EXPOSE 5000

# Security: use dumb-init for proper signal handling (PID 1 problem)
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
