# Context and Scope

## System Context

The NestJS template serves as a foundation for building secure and scalable backend applications. It provides a complete authentication and authorization system, user management, and a clean architecture that can be extended for specific business requirements.

```mermaid
C4Context
    title System Context Diagram
    
    Person(developer, "Application Developer", "building business applications")
    Person(endUser, "End User", "Interacts with application")
    
    System(nestjsTemplate, "NestJS Template", "Provides authentication, authorization, and user management with clean architecture")
    
    System_Ext(database, "PostgreSQL Database", "Stores user accounts, roles, permissions and tokens")
    System_Ext(emailService, "Email Service", "Sends verification emails and password reset links")
    System_Ext(clientApp, "Client Application", "Frontend or mobile app that consumes the API")
    
    Rel(developer, nestjsTemplate, "Extends, configures")
    Rel(nestjsTemplate, database, "Stores data in")
    Rel(nestjsTemplate, emailService, "Sends emails via")
    Rel(endUser, clientApp, "Uses")
    Rel(clientApp, nestjsTemplate, "Makes API calls to")
```

## External Interfaces

| Interface | Description | Protocol | Data Format |
|-----------|-------------|----------|-------------|
| REST API | Primary interface for client applications | HTTP/HTTPS | JSON |
| Database | Data persistence | TCP/IP | SQL (via Prisma) |
| Email Service | For sending verification emails | SMTP | Text/HTML |

## Domain Model

The core domain model represents the primary entities in the authentication and authorization system:

```mermaid
classDiagram
    User "1" -- "*" RefreshToken : has
    User "1" -- "1" EmailVerification : has
    User "1" -- "*" PasswordReset : has
    User "1" -- "1" OTP : has
    User "*" -- "*" Role : has
    Role "*" -- "*" Permission : has
    
    class User {
        +id: UserID
        +email: Email
        +password: Password
        +name: Name
        +isActive: boolean
        +isTwoFactorEnabled: boolean
        +twoFactorSecret: string
        +roles: Role[]
        +verified: boolean
    }
    
    class RefreshToken {
        +id: string
        +userId: UserID
        +token: Token
        +expiresAt: Date
        +createdAt: Date
    }
    
    class EmailVerification {
        +id: string
        +userId: UserID
        +code: VerificationCode
        +expiresAt: Date
        +verified: boolean
    }
    
    class PasswordReset {
        +id: string
        +userId: UserID
        +token: string
        +expiresAt: Date
        +used: boolean
    }
    
    class OTP {
        +id: string
        +userId: UserID
        +secret: string
        +verified: boolean
    }
    
    class Role {
        +id: string
        +name: string
        +permissions: Permission[]
    }
    
    class Permission {
        +id: string
        +name: PermissionName
        +resource: string
        +action: string
    }
```

This domain model represents the core entities in the system and their relationships, providing a foundation for the authentication and authorization features.
