# Testing Guide for NestJS Template

This guide explains how to run and write tests for the NestJS Template application.

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Running Tests](#running-tests)
3. [Test Types](#test-types)
4. [Test Structure](#test-structure)
5. [Test Helpers and Mocks](#test-helpers-and-mocks)
6. [Writing Tests](#writing-tests)
7. [Test Coverage](#test-coverage)

## Testing Overview

The application uses Jest as the testing framework and follows these testing principles:

- **Unit Tests**: Test individual components in isolation (services, value objects)
- **Integration Tests**: Test interactions between components (repositories with database)
- **End-to-End Tests**: Test complete request flows through the API endpoints

## Running Tests

### Unit and Integration Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:cov
```

### End-to-End Tests

```bash
# Start the required dependencies (database, etc.)
docker-compose up -d

# Run e2e tests
npm run test:e2e
```

## Test Types

### Unit Tests

- Located with the source files (*.spec.ts)
- Focus on individual classes and functions
- Use mocks for all dependencies
- Should be fast and not require external services

### Integration Tests

- Typically test interactions with infrastructure (database, external services)
- May require external services to be running

### End-to-End Tests

- Located in the `/test` directory (*.e2e-spec.ts)
- Test complete request flows and API endpoints
- Require the application to be running with dependencies

## Test Structure

Tests should follow the AAA pattern:

1. **Arrange**: Set up the test conditions
2. **Act**: Perform the action being tested
3. **Assert**: Verify the expected outcomes

Example:

```typescript
it('should authenticate a valid user', async () => {
  // Arrange
  const email = 'test@example.com';
  const password = 'ValidPassword123!';
  userRepository.findByEmail.mockResolvedValue(mockUser);
  bcrypt.compare.mockResolvedValue(true);
  
  // Act
  const result = await authService.authenticate(email, password);
  
  // Assert
  expect(result).toBeDefined();
  expect(result.accessToken).toBeDefined();
  expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
});
```

## Test Helpers and Mocks

The project provides several helpers and mocks to simplify testing:

### Repository Mocks

Located in `/src/test/mocks/repositories.mock.ts`. Use these to mock repository dependencies:

```typescript
import { createMockUserRepository } from '../../test/mocks/repositories.mock';

const userRepository = createMockUserRepository();
userRepository.findById.mockResolvedValue(mockUser);
```

### Test Fixtures

Located in `/src/test/fixtures/`. These provide standard test data:

```typescript
import { authFixtures } from '../../test/fixtures/auth.fixture';

const user = authFixtures.users.validUser();
```

### Config Mocks

Located in `/src/test/mocks/config.mock.ts`. Use these to mock configuration:

```typescript
import { createMockConfigService } from '../../test/mocks/config.mock';

const configService = createMockConfigService();
```

## Writing Tests

### Testing Services

1. Mock all dependencies
2. Test all public methods
3. Test happy paths, error paths, and edge cases

Example: See `/src/core/services/auth.service.spec.ts`

### Testing Controllers

1. Test the integration with services via mocks
2. Test request validation
3. Test response mapping

### Testing Repositories

1. Mock the Prisma service
2. Test mapping between domain entities and database models
3. Test error handling

Example: See `/src/infrastructure/repositories/user.repository.spec.ts`

### Testing Value Objects

1. Test validation rules
2. Test value normalization
3. Test equality methods

Example: See `/src/core/value-objects/email.vo.spec.ts`

## Test Coverage

The project aims for high test coverage, but focuses on meaningful coverage rather than just metrics.

Key areas that must have high coverage:
- Security-critical code (authentication, authorization)
- Business logic and domain rules
- Value object validation
- Repository mapping logic

To view the coverage report:

```bash
npm run test:cov
```

The report will be available in the `/coverage` directory.