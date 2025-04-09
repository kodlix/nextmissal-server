# Building Block View

## System Overview

The system architecture follows a clean architecture pattern with distinct layers:

```mermaid
flowchart TD
    subgraph "NestJS Template System"
        Presentation["Presentation Layer\n(Controllers, Guards)"];
        Application["Application Layer\n(Commands, Queries, DTOs)"];
        Domain["Domain Layer\n(Entities, Services, Interfaces)"];
        Infrastructure["Infrastructure Layer\n(Repositories, External Services)"];
        
        Presentation --> Application;
        Application --> Domain;
        Infrastructure --> Domain;
    end
```

## Level 1: Overall System

At the highest level, the system is composed of several main modules:

```mermaid
flowchart TD
    API["API Gateway"] --> Auth["Auth Module"];
    API --> User["User Module"];
    API --> Role["Role Module"];
    API --> Admin["Admin Module"];
    
    Auth --> UserDomain["User Domain"];
    User --> UserDomain;
    Role --> RoleDomain["Role Domain"];
    Admin --> UserDomain;
    Admin --> RoleDomain;
    
    UserDomain --> DB[("Database")];
    RoleDomain --> DB;
```

## Level 2: Core Modules

### Auth Module

```mermaid
componentDiagram
    component "Auth Controller" as AuthController
    component "Auth Service" as AuthService
    component "Token Provider" as TokenProvider
    component "JWT Strategy" as JWTStrategy
    component "Email Provider" as EmailProvider
    component "OTP Provider" as OTPProvider
    
    AuthController ..> AuthService : uses
    AuthService ..> TokenProvider : uses
    AuthService ..> EmailProvider : uses
    AuthService ..> OTPProvider : uses
    JWTStrategy ..> TokenProvider : uses
```

### User Module

```mermaid
componentDiagram
    component "User Controller" as UserController
    component "User Service" as UserService
    component "User Repository" as UserRepository
    
    UserController ..> UserService : uses
    UserService ..> UserRepository : uses
```

### Role Module

```mermaid
componentDiagram
    component "Role Controller" as RoleController
    component "Role Service" as RoleService
    component "Permission Service" as PermissionService
    component "Role Repository" as RoleRepository
    component "Permission Repository" as PermissionRepository
    
    RoleController ..> RoleService : uses
    RoleService ..> RoleRepository : uses
    RoleService ..> PermissionService : uses
    PermissionService ..> PermissionRepository : uses
```

## Level 3: Core Components

### Domain Layer Core Components

```mermaid
classDiagram
    class User {
        +UserID id
        +Email email
        +Password password
        +Name name
        +boolean isActive
        +boolean isTwoFactorEnabled
        +string twoFactorSecret
        +boolean isVerified
    }
    
    class Role {
        +string id
        +string name
        +Permission[] permissions
    }
    
    class Permission {
        +string id
        +PermissionName name
        +string resource
        +string action
    }
    
    class RefreshToken {
        +string id
        +UserID userId
        +Token token
        +Date expiresAt
    }
    
    class EmailVerification {
        +string id
        +UserID userId
        +VerificationCode code
        +Date expiresAt
        +boolean verified
    }
    
    class OTP {
        +string id
        +UserID userId
        +string secret
        +boolean verified
    }
    
    User "1" -- "*" RefreshToken : has
    User "1" -- "1" EmailVerification : may have
    User "1" -- "1" OTP : may have
    User "*" -- "*" Role : has
    Role "*" -- "*" Permission : has
```

### Application Layer Core Components

```mermaid
classDiagram
    class RegisterUserCommand {
        +string email
        +string password
        +string name
        +execute()
    }
    
    class LoginCommand {
        +string email
        +string password
        +execute()
    }
    
    class RefreshTokenCommand {
        +string refreshToken
        +execute()
    }
    
    class VerifyEmailCommand {
        +string userId
        +string code
        +execute()
    }
    
    class SetupTwoFactorCommand {
        +string userId
        +execute()
    }
    
    class CreateRoleCommand {
        +string name
        +string[] permissions
        +execute()
    }
    
    class GetUserQuery {
        +string id
        +execute()
    }
    
    class GetRolesQuery {
        +execute()
    }
```

### Infrastructure Layer Core Components

```mermaid
classDiagram
    class BaseRepository {
        +create()
        +findById()
        +findAll()
        +update()
        +delete()
    }
    
    class UserRepository {
        +findByEmail()
        +findByIdWithRoles()
    }
    
    class RoleRepository {
        +findByName()
        +findWithPermissions()
    }
    
    class RefreshTokenRepository {
        +findByToken()
        +deleteAllForUser()
    }
    
    class EmailVerificationRepository {
        +findByUserId()
        +findByCode()
    }
    
    class PrismaService {
        +user
        +role
        +permission
        +refreshToken
        +emailVerification
    }
    
    BaseRepository <|-- UserRepository
    BaseRepository <|-- RoleRepository
    BaseRepository <|-- RefreshTokenRepository
    BaseRepository <|-- EmailVerificationRepository
    
    UserRepository --> PrismaService
    RoleRepository --> PrismaService
    RefreshTokenRepository --> PrismaService
    EmailVerificationRepository --> PrismaService
```

These building blocks compose the clean architecture pattern implemented in the NestJS template, providing a modular and maintainable structure for the application.
