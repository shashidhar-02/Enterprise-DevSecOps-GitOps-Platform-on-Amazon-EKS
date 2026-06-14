# ---- Build stage ----
FROM maven:3.9.5-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy shared libraries and install them to the local container .m2 repository
COPY shared ./shared
RUN cd shared/common && mvn clean install -DskipTests || true
RUN cd shared/contracts && mvn clean install -DskipTests || true
RUN cd shared/events && mvn clean install -DskipTests || true
RUN cd shared/exceptions && mvn clean install -DskipTests || true

# Copy this specific microservice and package it
COPY backend/payment-service ./backend/payment-service
RUN cd backend/payment-service && mvn clean package -DskipTests

# ---- Production stage ----
FROM eclipse-temurin:17-jre-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN apk --no-cache add dumb-init

WORKDIR /app
COPY --from=build /app/backend/payment-service/target/*.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 8080

ENTRYPOINT ["dumb-init", "--"]
CMD ["java", "-jar", "app.jar"]
