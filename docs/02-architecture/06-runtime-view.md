# Runtime View

## Key Scenarios

This section illustrates the runtime behavior of the system in key scenarios.

### User Registration Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant RegisterUserCommand
    participant UserService
    participant UserRepository
    participant EmailService
    
    Client->>AuthController: POST /auth/register (email, password, name)
    AuthController->>RegisterUserCommand: execute(dto)
    
    RegisterUserCommand->>UserService: findByEmail(email)
    UserService->>UserRepository: findByEmail(email)
    UserRepository-->>UserService: null (user doesn't exist)
    
    RegisterUserCommand->>UserService: create(userData)
    UserService->>UserRepository: create(user)
    UserRepository-->>UserService: createdUser
    
    RegisterUserCommand->>EmailService: sendVerificationEmail(user)
    EmailService-->>RegisterUserCommand: success
    
    RegisterUserCommand-->>AuthController: userResponse
    AuthController-->>Client: 201 Created (user data)
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant LoginCommand
    participant AuthService
    participant UserService
    participant TokenProvider
    participant UserRepository
    participant RefreshTokenRepository
    
    Client->>AuthController: POST /auth/login (email, password)
    AuthController->>LoginCommand: execute(dto)
    
    LoginCommand->>UserService: findByEmail(email)
    UserService->>UserRepository: findByEmail(email)
    UserRepository-->>UserService: user
    UserService-->>LoginCommand: user
    
    LoginCommand->>AuthService: validatePassword(user, password)
    AuthService-->>LoginCommand: isValid
    
    alt Password valid
        LoginCommand->>TokenProvider: generateAccessToken(user)
        TokenProvider-->>LoginCommand: accessToken
        
        LoginCommand->>TokenProvider: generateRefreshToken(user)
        TokenProvider-->>LoginCommand: refreshToken
        
        LoginCommand->>RefreshTokenRepository: save(refreshToken)
        RefreshTokenRepository-->>LoginCommand: savedToken
        
        LoginCommand-->>AuthController: {accessToken, refreshToken}
        AuthController-->>Client: 200 OK (tokens)
    else Password invalid
        LoginCommand-->>AuthController: error
        AuthController-->>Client: 401 Unauthorized
    end
```

### Token Refresh Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant RefreshTokenCommand
    participant TokenProvider
    participant RefreshTokenRepository
    participant UserRepository
    
    Client->>AuthController: POST /auth/refresh (refreshToken)
    AuthController->>RefreshTokenCommand: execute(dto)
    
    RefreshTokenCommand->>TokenProvider: validateRefreshToken(refreshToken)
    TokenProvider-->>RefreshTokenCommand: tokenData
    
    RefreshTokenCommand->>RefreshTokenRepository: findByToken(refreshToken)
    RefreshTokenRepository-->>RefreshTokenCommand: storedToken
    
    RefreshTokenCommand->>UserRepository: findById(tokenData.userId)
    UserRepository-->>RefreshTokenCommand: user
    
    RefreshTokenCommand->>TokenProvider: generateAccessToken(user)
    TokenProvider-->>RefreshTokenCommand: newAccessToken
    
    RefreshTokenCommand->>TokenProvider: generateRefreshToken(user)
    TokenProvider-->>RefreshTokenCommand: newRefreshToken
    
    RefreshTokenCommand->>RefreshTokenRepository: delete(storedToken.id)
    RefreshTokenRepository-->>RefreshTokenCommand: success
    
    RefreshTokenCommand->>RefreshTokenRepository: save(newRefreshToken)
    RefreshTokenRepository-->>RefreshTokenCommand: savedToken
    
    RefreshTokenCommand-->>AuthController: {accessToken, refreshToken}
    AuthController-->>Client: 200 OK (tokens)
```

### Authorization Check Flow

```mermaid
sequenceDiagram
    participant Client
    participant Guard
    participant JwtStrategy
    participant TokenProvider
    participant UserService
    participant UserRepository
    participant PermissionService
    
    Client->>Guard: Request with JWT
    Guard->>JwtStrategy: validate(token)
    JwtStrategy->>TokenProvider: verifyToken(token)
    TokenProvider-->>JwtStrategy: payload (userId)
    
    JwtStrategy->>UserService: findById(userId)
    UserService->>UserRepository: findByIdWithRoles(userId)
    UserRepository-->>UserService: user (with roles)
    UserService-->>JwtStrategy: user
    
    JwtStrategy-->>Guard: user
    
    alt Requires Permissions
        Guard->>PermissionService: hasPermission(user, requiredPermission)
        PermissionService-->>Guard: hasAccess
        
        alt Has Access
            Guard-->>Client: Allow request
        else No Access
            Guard-->>Client: 403 Forbidden
        end
    else No Permission Required
        Guard-->>Client: Allow request
    end
```

### Two-Factor Authentication Setup

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant Setup2FACommand
    participant AuthService
    participant OtpProvider
    participant UserRepository
    
    Client->>AuthController: POST /auth/2fa/setup
    AuthController->>Setup2FACommand: execute(userId)
    
    Setup2FACommand->>OtpProvider: generateSecret()
    OtpProvider-->>Setup2FACommand: secret
    
    Setup2FACommand->>OtpProvider: generateQRCode(secret, user.email)
    OtpProvider-->>Setup2FACommand: qrCodeUrl
    
    Setup2FACommand->>UserRepository: update(userId, {twoFactorSecret: secret})
    UserRepository-->>Setup2FACommand: updatedUser
    
    Setup2FACommand-->>AuthController: {secret, qrCodeUrl}
    AuthController-->>Client: 200 OK (secret and QR code)
```

### Email Verification Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant VerifyEmailCommand
    participant EmailVerificationRepository
    participant UserRepository
    
    Client->>AuthController: POST /auth/verify-email (userId, code)
    AuthController->>VerifyEmailCommand: execute(dto)
    
    VerifyEmailCommand->>EmailVerificationRepository: findByUserIdAndCode(userId, code)
    EmailVerificationRepository-->>VerifyEmailCommand: verification
    
    alt Valid Code
        VerifyEmailCommand->>EmailVerificationRepository: update(verification.id, {verified: true})
        EmailVerificationRepository-->>VerifyEmailCommand: updatedVerification
        
        VerifyEmailCommand->>UserRepository: update(userId, {verified: true})
        UserRepository-->>VerifyEmailCommand: updatedUser
        
        VerifyEmailCommand-->>AuthController: success
        AuthController-->>Client: 200 OK
    else Invalid Code
        VerifyEmailCommand-->>AuthController: error
        AuthController-->>Client: 400 Bad Request
    end
```

These runtime views illustrate the key flows in the system, showing how the different components interact to implement the application's features.
