# Testing Guide

This document provides guidelines for writing and running tests in the NestJS Clean Architecture Template.

## Types of Tests

The project supports several types of tests:

1. **Unit Tests**: Tests for individual components or classes
2. **Integration Tests**: Tests for interactions between components
3. **End-to-End (E2E) Tests**: Tests for the full application from the client perspective

## Running Tests

### Unit and Integration Tests

Run the unit and integration tests with the following command:

```bash
npm test
```

For watch mode, which automatically reruns tests when files change:

```bash
npm run test:watch
```

To check test coverage:

```bash
npm run test:cov
```

### End-to-End Tests

Run the e2e tests with:

```bash
npm run test:e2e
```

## Test Configuration

- **Unit tests**: Configured in the `jest` section of `package.json`
- **E2E tests**: Configured in `test/jest-e2e.json`

## Directory Structure

- Unit and integration tests are stored next to the files they test with a `.spec.ts` suffix.
- E2E tests are stored in the `/test` directory with a `.e2e-spec.ts` suffix.
- Test fixtures and mocks should be placed in `/src/test` directory:
  - `/src/test/fixtures`: Test data for tests
  - `/src/test/mocks`: Mock implementations of classes and services

## Writing Tests

### Unit Tests

Unit tests focus on testing individual classes or functions in isolation.

```typescript
// Example unit test for a value object
import { Email } from './email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = new Email('test@example.com');
    expect(email).toBeDefined();
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw error for invalid email', () => {
    expect(() => new Email('not-an-email')).toThrow();
  });
});
```

### Mocking Dependencies

Use Jest's mocking capabilities to isolate components:

```typescript
// Example of mocking a repository
jest.mock('@infrastructure/repositories/user.repository', () => ({
  UserRepository: jest.fn().mockImplementation(() => ({
    findById: jest.fn().mockResolvedValue({
      id: 'user-id',
      email: 'test@example.com',
      // other properties
    }),
    // other repository methods
  })),
}));
```

For more complex mocks, place them in the `/src/test/mocks` directory.

### E2E Tests

E2E tests should test the application through its HTTP endpoints:

```typescript
// Example e2e test
describe('AuthController (e2e)', () => {
  // Setup code...

  it('should register a new user', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email', 'test@example.com');
      });
  });
});
```

## Testing with the Database

The e2e tests provided in the project often skip tests that need real database access. This is because e2e tests typically run against an in-memory server without a database.

When you need to test with a real database:

1. Use a separate test database
2. Set up a testing module with a real database connection or a test database like SQLite
3. Make sure to reset the database state before each test

Alternatively, you can build a mock database service for testing.

## Test Fixtures

Store common test data in fixtures to reuse across tests:

```typescript
// Example fixture in /src/test/fixtures/user.fixture.ts
export const userFixture = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
  password: 'hashedPassword123',
  firstName: 'Test',
  lastName: 'User',
  isActive: true,
  roles: ['user'],
  permissions: ['user:read'],
};
```

Then import and use in tests:

```typescript
import { userFixture } from '@test/fixtures/user.fixture';

// use userFixture in test
```

## Best Practices

1. **Test in isolation**: Unit tests should test only one component at a time.
2. **Use descriptive test names**: Name your tests clearly to describe what they are testing.
3. **Arrange, Act, Assert**: Structure your tests with clear setup, execution, and verification phases.
4. **Avoid test interdependence**: Each test should be able to run independently.
5. **Test error cases**: Don't just test the happy path; test error conditions too.
6. **Keep tests fast**: Tests should run quickly to encourage developers to run them often.
7. **Use test coverage tools**: Identify untested code with coverage reports.
8. **Avoid testing private methods directly**: Test the public interface and behavior.
9. **Use appropriate granularity**: Unit tests for detailed logic, integration and e2e tests for system behavior.
10. **Mock external dependencies**: Use test doubles for databases, APIs, file systems, etc.