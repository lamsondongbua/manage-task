# Manage Task - Fullstack Web Application

Manage Task is a modern, full-stack web application designed for efficient task management. The project is built with a robust Spring Boot backend and a highly interactive, animated React frontend.

## 🚀 Features

- **User Authentication & Authorization**: Secure login and registration using JWT (JSON Web Tokens).
- **Task Management**: Create, view, update, and delete tasks.
- **User Profiles**: Manage user information.
- **Rich User Interface**: Smooth scrolling, 3D elements, and micro-animations for a premium user experience.
- **API Documentation**: Automated API documentation using Swagger UI and OpenAPI.
- **Database Migrations**: Version-controlled database schema management using Flyway.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM
- **Animations & 3D**: Framer Motion, GSAP, Three.js, React Three Fiber, React Three Drei
- **Smooth Scrolling**: Lenis (@studio-freight/lenis)
- **Icons**: Lucide React

### Backend
- **Framework**: Spring Boot 3.3.4 (Java 21)
- **Security**: Spring Security + JWT (jjwt)
- **Data Access**: Spring Data JPA
- **Database**: PostgreSQL
- **Migrations**: Flyway
- **API Documentation**: Springdoc OpenAPI (Swagger UI)
- **Templating**: Thymeleaf (for specific server-side views)

## 🏗️ Project Structure

The repository is divided into two main parts:

- `demo/`: Contains the Spring Boot backend source code.
- `Frontend/`: Contains the React + Vite frontend source code.

## ⚙️ Getting Started

### Prerequisites

- Java 21
- Node.js (v18 or higher)
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd demo
   ```
2. Configure your database connection in `src/main/resources/application.properties` (or your active profile). Ensure you have created a PostgreSQL database.
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The application will start on `http://localhost:8080`. Flyway will automatically run the database migrations.*

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

## 📚 API Documentation

Once the backend is running, you can access the interactive API documentation at:
- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

*(Note: On free cloud hosting providers like Render, the first request may take 1-2 minutes to spin up the server).*

## 📄 License

This project is open-source and available under the MIT License.
