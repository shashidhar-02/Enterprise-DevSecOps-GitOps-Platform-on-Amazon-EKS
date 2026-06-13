# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
# Use npm ci for secure, clean, repeatable builds
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve using NGINX running as non-root user for security hardening
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Establish NGINX permissions and pid files for the non-root 'nginx' user (UID 101)
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Enforce running as the non-root 'nginx' user
USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
