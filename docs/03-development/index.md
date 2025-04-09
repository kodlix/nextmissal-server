# Development Documentation

## Introduction

This section provides guidelines, standards, and best practices for developing and contributing to the project.

## Documents in this Section

- [Coding Standards](./coding-standards.md) - Code style and organization guidelines
- [Testing Strategy](./testing-strategy.md) - Comprehensive testing approach

## Development Environment Setup

To set up a development environment:

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (see `.env.example`)
4. Start the development server with `npm run start:dev`

For a containerized development environment, use Docker Compose:

```bash
docker-compose up -d
```

## Development Workflow

1. Create a feature branch from `main`
2. Implement changes following coding standards
3. Write tests for new functionality
4. Submit a pull request for review
5. Address review feedback
6. Merge to `main` after approval

## Key Development Commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start the development server with hot reload |
| `npm run lint` | Run ESLint to check code quality |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run prisma:migrate:dev` | Generate and apply database migrations |
| `npm run prisma:studio` | Open Prisma Studio for database management |
