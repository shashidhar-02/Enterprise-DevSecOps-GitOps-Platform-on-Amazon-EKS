# ==============================================================
# CraveDrop Frontend - Production Dockerfile
# ==============================================================

# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependencies first for better caching
COPY package.json package-lock.json *./
RUN npm ci && npm cache clean --force

# Copy the rest of the source code and build
COPY src/ ./src
COPY public/ ./public
COPY vite.config.js index.html ./
RUN npm run build

# ---- Production stage ----
FROM nginx:1.27-alpine AS production

# Security: remove default nginx config and default html files
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy our custom CraveDrop nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Security: Set up permissions so Nginx can run as a non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
