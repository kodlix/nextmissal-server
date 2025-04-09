# NestJS Template Architecture Overview

## Introduction

This document provides a high-level overview of the NestJS Template architecture and serves as an entry point to our comprehensive technical documentation. The NestJS Template is designed to provide a robust foundation for building secure, scalable, and maintainable backend applications following clean architecture principles.

## Architecture Documentation

For a complete understanding of the system architecture, please refer to our detailed [Architecture Documentation](./architecture/00-index.md) which follows the arc42 template structure.

## Key Architecture Principles

1. **Clean Architecture**: The system is structured in concentric layers with clear boundaries:
   - Core/Domain Layer
   - Application Layer
   - Infrastructure Layer
   - Presentation Layer

2. **Domain-Driven Design**: The domain model uses entities, value objects, and domain services to encapsulate business logic with clear boundaries.

3. **Command Query Responsibility Segregation (CQRS)**: Operations are separated into commands (write) and queries (read) for clearer separation of concerns.

## Core Features

- **Authentication**: JWT-based authentication with refresh token rotation, email verification, and optional two-factor authentication
- **Authorization**: Hybrid role and permission-based access control system
- **User Management**: Complete user lifecycle management including registration, profile updates, and password management
- **Security**: Rate limiting, input validation, and comprehensive error handling
- **Modularity**: Clean separation of concerns through layered architecture

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Deployment**: Docker

## Getting Started

To get started with the architecture documentation:

1. Begin with the [Introduction and Goals](./architecture/01-introduction-goals.md) for a high-level overview
2. Explore the [Building Block View](./architecture/05-building-blocks.md) to understand the system components
3. Review the [Runtime View](./architecture/06-runtime-view.md) to understand key system flows
4. Check the [Deployment View](./architecture/07-deployment-view.md) for deployment considerations

## Architecture Decision Records

For understanding the reasoning behind key technical decisions, refer to the [Architecture Decisions](./architecture/09-decisions.md) section.

## Diagrams

The architecture documentation includes various diagrams to illustrate different aspects of the system:

- System context diagrams
- Component diagrams
- Sequence diagrams
- Deployment diagrams
- Domain model diagrams

All diagrams use the Mermaid syntax for consistency and maintainability.

## Quality and Risks

For information about quality requirements and technical risks:

- [Quality Requirements](./architecture/10-quality.md)
- [Risks and Technical Debt](./architecture/11-risks.md)

## Glossary

A comprehensive [Glossary](./architecture/12-glossary.md) is available to explain domain and technical terminology used throughout the documentation.