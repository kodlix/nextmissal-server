# Contributing to NestJS Template

Thank you for your interest in contributing to the NestJS Clean Architecture template! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/nestjs-template.git
   cd nestjs-template
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start Development Services**
   ```bash
   docker-compose up -d  # Start PostgreSQL and MinIO
   npm run db:migrate    # Run database migrations
   npm run db:seed       # Seed the database
   ```

5. **Start Development Server**
   ```bash
   npm run start:dev
   ```

## 🔄 Contributing Process

1. **Check existing issues** - Look for existing issues or create a new one
2. **Create a feature branch** - Branch from `main`
3. **Make your changes** - Follow our coding standards
4. **Test your changes** - Ensure all tests pass
5. **Submit a pull request** - Use our PR template

## 📝 Coding Standards

### Architecture Principles

This project follows **Clean Architecture** with **Domain-Driven Design (DDD)** and **CQRS** patterns:

- **Core Layer**: Domain entities, value objects, and repository interfaces
- **Application Layer**: Use cases, commands, queries, and DTOs
- **Infrastructure Layer**: External concerns (database, email, storage)
- **Presentation Layer**: Controllers, guards, filters, and modules

### Code Style

- **TypeScript**: Use strict TypeScript settings
- **Formatting**: Prettier with the existing configuration
- **Linting**: ESLint with the project configuration
- **Naming**: Use descriptive names and follow TypeScript conventions

### File Organization

```
src/
├── core/              # Domain layer
│   ├── entities/      # Domain entities
│   ├── value-objects/ # Value objects
│   ├── repositories/  # Repository interfaces
│   └── services/      # Domain services
├── application/       # Application layer
│   ├── commands/      # Command handlers
│   ├── queries/       # Query handlers
│   ├── dtos/          # Data transfer objects
│   └── mappers/       # Entity to DTO mappers
├── infrastructure/    # Infrastructure layer
│   ├── database/      # Database implementations
│   ├── repositories/  # Repository implementations
│   └── services/      # External service implementations
└── presentation/      # Presentation layer
    ├── controllers/   # REST controllers
    ├── guards/        # Authentication/authorization
    ├── filters/       # Exception filters
    └── modules/       # NestJS modules
```

## 🧪 Testing Guidelines

### Test Types

1. **Unit Tests** (`*.spec.ts`)
   - Test individual functions and classes
   - Mock external dependencies
   - Aim for 80%+ coverage

2. **Integration Tests** (`*.integration.spec.ts`)
   - Test interactions between components
   - Use test database

3. **E2E Tests** (`*.e2e-spec.ts`)
   - Test complete user flows
   - Use test environment

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# All tests
npm run test:all
```

### Writing Tests

- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test both success and error cases

```typescript
describe('AuthService', () => {
  it('should authenticate user with valid credentials', async () => {
    // Arrange
    const loginDto = { email: 'test@example.com', password: 'password' };
    
    // Act
    const result = await authService.login(loginDto);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.accessToken).toBeTruthy();
  });
});
```

## 📄 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(auth): add two-factor authentication

Add TOTP-based 2FA with QR code generation and verification.
Includes setup, verification, and disable endpoints.

Closes #123
```

```
fix(user): resolve email validation issue

Fix email value object validation to properly handle 
international domain names.
```

## 🔀 Pull Request Process

### Before Submitting

1. **Rebase your branch** on the latest `main`
2. **Run all tests** and ensure they pass
3. **Run linting** and fix any issues
4. **Update documentation** if needed
5. **Test your changes** thoroughly

### PR Requirements

- [ ] Clear description of changes
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or clearly documented)
- [ ] All CI checks passing

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass locally
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Address feedback** promptly
4. **Squash and merge** when approved

## 🏷️ Issue Guidelines

### Bug Reports

Use the bug report template and include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error messages/logs

### Feature Requests

Use the feature request template and include:
- Clear description
- Use case/motivation
- Proposed solution
- Additional context

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)

## 💬 Questions?

- Open an issue for bugs or feature requests
- Check existing documentation
- Reach out to maintainers

Thank you for contributing! 🎉