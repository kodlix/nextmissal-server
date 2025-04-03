# End-to-End Tests

This directory contains end-to-end (e2e) tests for the NestJS Clean Architecture Template.

## Overview

The e2e tests validate the application's endpoints through its HTTP interfaces, ensuring that:

1. Endpoints respond correctly to authorized and unauthorized requests
2. Validation works correctly for invalid inputs
3. API routes and prefixes are configured properly
4. Authentication and authorization mechanisms are working as expected

## Test Files

- `auth.e2e-spec.ts` - Tests for all authentication endpoints
- `user.e2e-spec.ts` - Tests for user management endpoints
- `role.e2e-spec.ts` - Tests for role management endpoints

## Running Tests

Run the e2e tests with:

```bash
npm run test:e2e
```

## Test Structure

Each test file follows a similar pattern:

1. Setup code in `beforeAll()` that creates a test application
2. Sets up validation pipes, global prefixes, and jwt tokens
3. Individual test cases for each endpoint
4. Cleanup code in `afterAll()`

## Test Environment

The tests are configured to run without a connection to a real database. This is why some tests that would require database verification are skipped (`it.skip`).

The tests use:

- In-memory NestJS application
- JWT tokens for authentication tests
- HTTP request testing via supertest

## Database-less Testing Strategy

Since the e2e tests run without a real database:

1. Tests focus on validation, authentication, and authorization layers
2. We expect 401 (Unauthorized) for authenticated routes even with valid JWT tokens
3. We expect 400 (Bad Request) for invalid inputs

## Advanced Testing

For more advanced testing with a real or test database:

1. Set up a test database instance
2. Add database seeding before tests
3. Modify the `beforeAll()` setup to connect to the test database
4. Enable the skipped tests by removing the `.skip`

For more information, see `/docs/TESTING.md`.