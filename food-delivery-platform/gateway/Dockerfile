FROM nginx:alpine

# Security: add dumb-init
RUN apk --no-cache add dumb-init

# Add configurations
COPY nginx.conf /etc/nginx/nginx.conf
COPY proxy_params /etc/nginx/proxy_params

EXPOSE 80

# Security: use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
