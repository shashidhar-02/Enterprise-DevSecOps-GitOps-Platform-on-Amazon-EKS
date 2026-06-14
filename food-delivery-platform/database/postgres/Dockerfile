FROM postgres:15-alpine

# Copy initialization scripts
# Scripts in /docker-entrypoint-initdb.d/ run in alphabetical order
COPY ./init/*.sql /docker-entrypoint-initdb.d/
COPY ./schema/*.sql /docker-entrypoint-initdb.d/

# Set default env
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=secretpassword
