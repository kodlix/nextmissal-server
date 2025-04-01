# Two-Factor Authentication (2FA) Guide

This document explains how to use the two-factor authentication features in the application.

## Overview

The application supports two types of one-time password (OTP) functionality:

1. **Temporary OTP** - Used for specific scenarios like account verification
2. **Persistent 2FA** - Used for ongoing two-factor authentication when users log in

## Temporary OTP

Temporary OTP is generated for a specific purpose and expires after a set time (usually 5 minutes).

### Generate a Temporary OTP

```
POST /api/auth/generate-otp
```

Request body:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Response:
```json
{
  "otp": "123456"
}
```

### Verify a Temporary OTP

```
POST /api/auth/verify-otp
```

Request body:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "otp": "123456"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a15e7a47-7a8f-4f1a-b3a7-c1524e7f324b",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "user"
      }
    ]
  }
}
```

## Persistent 2FA (Two-Factor Authentication)

Persistent 2FA is used to add an extra layer of security for user logins. When enabled, users will need to provide a time-based one-time password (TOTP) from an authenticator app after providing their username and password.

### Setup 2FA

```
POST /api/auth/2fa/setup
```

Request body:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Response:
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgo..."
}
```

The QR code should be displayed to the user to scan with their authenticator app (like Google Authenticator, Authy, etc.). The secret should be stored securely as a backup.

### Verify 2FA Token

```
POST /api/auth/2fa/verify
```

Request body:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "token": "123456"
}
```

Response:
```json
{
  "verified": true
}
```

### Disable 2FA

```
POST /api/auth/2fa/disable
```

Request body:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

## Login Flow with 2FA

When a user has 2FA enabled, the login flow will have two steps:

1. The user provides email and password
2. The API responds with a special response indicating 2FA is required:

```json
{
  "requiresOtp": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "OTP verification required"
}
```

3. The client application should prompt the user for a 2FA code from their authenticator app
4. The client then sends the code to the verify-otp endpoint
5. If successful, the API returns the authentication tokens

## Implementation Details

### Authenticator App Compatibility

The system uses TOTP (Time-based One-Time Password) according to RFC 6238, which is compatible with all major authenticator apps:

- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- LastPass Authenticator
- And others

### Security Considerations

- The secret used for 2FA should never be transmitted after the initial setup
- The QR code is only displayed once during setup
- Backup codes can be provided for account recovery (not implemented in this version)
- Users should be encouraged to save their 2FA secret in a secure location as a backup