# Stage 1: Dependency builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
# Use npm ci for clean, repeatable, secure installations
RUN npm ci --omit=dev

# Stage 2: Clean runtime environment
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# Copy production dependencies and application source only
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src/ ./src/

# Enforce Least Privilege by running as the built-in non-root 'node' user
USER node

EXPOSE 8080
# Run node directly (instead of npm) to properly handle OS signals (like SIGTERM)
CMD ["node", "src/server.js"]
