# Glossary

## Domain Terminology

| Term | Definition |
|------|------------|
| User | An individual who has registered with the system and can authenticate to use protected features |
| Role | A named collection of permissions that can be assigned to users |
| Permission | A specific authorization to perform an action on a resource |
| JWT | JSON Web Token, a compact, URL-safe means of representing claims to be transferred between two parties |
| Refresh Token | A token used to obtain a new access token when the current one expires |
| Two-Factor Authentication (2FA) | An extra layer of security that requires not only a password but also a second factor (typically a temporary code) |
| OTP | One-Time Password, a code that is valid for only one login session or transaction |
| TOTP | Time-based One-Time Password, an algorithm that generates a one-time password which changes based on the current time |
| Rate Limiting | Controlling the amount of requests a user can make to an API within a time window |
| Email Verification | The process of confirming a user's email address ownership through a verification code or link |
| Password Reset | The process of allowing a user to securely establish a new password when they've forgotten their original one |

## Technical Terminology

| Term | Definition |
|------|------------|
| Clean Architecture | A software design philosophy that separates concerns into layers, with dependencies pointing inward |
| Domain-Driven Design (DDD) | An approach to software development that focuses on creating a model that reflects the business domain |
| CQRS | Command Query Responsibility Segregation, a pattern that separates read and update operations |
| Entity | An object with a distinct identity that persists over time |
| Value Object | An immutable object that has attributes but no identity |
| Repository | A mechanism for encapsulating storage, retrieval, and search behavior |
| Command | An object that represents the intent to perform an action or change state |
| Query | An object that represents a request for information without changing state |
| DTO | Data Transfer Object, an object that carries data between processes |
| Guard | In NestJS, a class that determines whether a request should be processed by the route handler |
| Interceptor | In NestJS, a class that intercepts the execution of a handler or another interceptor |
| Filter | In NestJS, a class that handles exceptions thrown during request processing |
| Decorator | A feature that allows adding metadata to classes, methods or properties |
| ORM | Object-Relational Mapping, a technique for converting data between incompatible type systems (e.g., database and objects) |
| Prisma | A next-generation ORM for Node.js and TypeScript |
| bcrypt | A password hashing function designed to be slow and resist brute-force attacks |
| PostgreSQL | An open-source relational database management system |

## Architecture Patterns

| Pattern | Description |
|---------|-------------|
| Repository Pattern | Abstracts the data layer, mediating between the domain and data mapping layers |
| Factory Pattern | A creational pattern that uses factory methods to create objects |
| Strategy Pattern | Defines a family of algorithms, encapsulates each one, and makes them interchangeable |
| Decorator Pattern | Dynamically adds responsibilities to objects without modifying their code |
| Adapter Pattern | Allows incompatible interfaces to work together |
| Singleton Pattern | Ensures a class has only one instance and provides a global point of access to it |
| Observer Pattern | Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified |

## Testing Terminology

| Term | Definition |
|------|------------|
| Unit Test | Tests individual components in isolation |
| Integration Test | Tests the interaction between components |
| E2E Test | Tests the entire application flow from start to finish |
| Mock | A simulated object that mimics the behavior of real objects in controlled ways |
| Stub | A controlled replacement for an existing dependency |
| Test Fixture | Fixed state used as a baseline for running tests |
| Test Coverage | A measure of how much of the code is exercised by tests |

## Infrastructure and Deployment

| Term | Definition |
|------|------------|
| Docker | A platform for developing, shipping, and running applications in containers |
| Container | A standard unit of software that packages code and dependencies together |
| Docker Compose | A tool for defining and running multi-container Docker applications |
| Environment Variable | A dynamic-named value that can affect the way running processes behave |
| CI/CD | Continuous Integration/Continuous Deployment, practices of automating integration and deployment of code |
| Kubernetes | An open-source system for automating deployment, scaling, and management of containerized applications |
| Horizontal Scaling | Adding more instances of an application to distribute load |
| Vertical Scaling | Adding more resources (CPU, RAM) to an existing instance |

This glossary provides a reference for the terminology used throughout the architecture documentation, helping ensure a common understanding of concepts and terms used in the system.
