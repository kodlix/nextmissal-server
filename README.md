# NestJS Clean Architecture Template

A robust NestJS template with Clean Architecture implementation, featuring User Authentication with OTP, Role-based Authorization, and Admin features.

## Features

- **Clean Architecture**: Core, Application, Infrastructure, and Presentation layers
- **Authentication**:
  - JWT-based authentication
  - Refresh token functionality
  - OTP (One-Time Password) support
  - Two-factor authentication
- **Authorization**:
  - Role-based access control
  - Permission-based authorization
- **Users Management**:
  - CRUD operations
  - User profile management
- **Admin Panel**:
  - Admin dashboard
  - User management
  - Role management
- **Database**:
  - Prisma ORM with PostgreSQL
- **Documentation**:
  - Swagger API documentation

## Architecture

```
📦 src
 ┣ 📂 core                # Domain logic (clean, independent)
 ┃ ┣ 📂 entities          # Domain Models
 ┃ ┣ 📂 value-objects     # Value Objects
 ┃ ┣ 📂 repositories      # Repository interfaces
 ┃ ┗ 📂 services          # Business logic
 ┃
 ┣ 📂 application         # Application logic (CQRS)
 ┃ ┣ 📂 commands          # Commands (Command Handlers)
 ┃ ┣ 📂 queries           # Queries (Query Handlers)
 ┃ ┣ 📂 dtos              # DTOs (Data Transfer Objects)
 ┃ ┗ 📂 events            # Events (Event Handlers)
 ┃
 ┣ 📂 infrastructure      # Infrastructure layer
 ┃ ┣ 📂 database          # Database (Prisma)
 ┃ ┣ 📂 repositories      # Repository implementations
 ┃ ┣ 📂 http              # API clients
 ┃ ┗ 📂 config            # Configuration, environment variables
 ┃
 ┣ 📂 presentation        # API layer (NestJS)
 ┃ ┣ 📂 controllers       # Controllers (REST, GraphQL)
 ┃ ┣ 📂 guards            # Guards (authorization)
 ┃ ┣ 📂 interceptors      # Request/Response interception
 ┃ ┣ 📂 filters           # Exception Filters
 ┃ ┗ 📂 middlewares       # Middleware
 ┃
 ┣ 📂 shared              # Common utilities
 ┃ ┣ 📂 utils             # Helpers
 ┃ ┣ 📂 constants         # Constants
 ┃ ┗ 📂 decorators        # Custom decorators
 ┃
 ┣ 📜 main.ts             # Application entry point
 ┗ 📜 app.module.ts       # Main module
```

## Installation

```bash
$ npm install
```

## Database Setup

This project uses Prisma ORM with PostgreSQL. You need to set up the database before running the application.

```bash
# Generate Prisma client
$ npx prisma generate

# Create database and apply migrations (if database exists)
$ npx prisma migrate dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

The application comes with Swagger documentation. Once the application is running, you can access the Swagger UI at:

```
http://localhost:3001/docs
```

This provides an interactive API documentation where you can:
- View all available endpoints
- See request/response schemas
- Test API endpoints directly from the browser
- Authenticate using JWT tokens

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestjs_template?schema=public"

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# OTP
OTP_SECRET=your_otp_secret_key_here
OTP_EXPIRATION=5m
OTP_STEP=30
OTP_DIGITS=6
```

## License

This project is [MIT licensed](LICENSE).