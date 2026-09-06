# ==================== Stage 1: Build ====================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml first for layer caching
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Copy source code
COPY src ./src

# Build application
RUN ./mvnw package -DskipTests -q


# ==================== Stage 2: Runtime ====================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy generated JAR
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]