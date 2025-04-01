# Authentication API Documentation

## Endpoints

### Register User

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth**: None (Public)
- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response**: Status `201 Created`
  ```json
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth**: None (Public)
- **Description**: Authenticate a user and get access tokens
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response**: Status `200 OK` (Non-OTP User)
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
- **Response**: Status `200 OK` (OTP-enabled User)
  ```json
  {
    "requiresOtp": true,
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "message": "OTP verification required"
  }
  ```

### Verify OTP

- **URL**: `/api/auth/verify-otp`
- **Method**: `POST`
- **Auth**: None (Public)
- **Description**: Verify OTP for two-factor authentication
- **Request Body**:
  ```json
  {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "otp": "123456"
  }
  ```
- **Response**: Status `200 OK`
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "b25e7a47-7a8f-4f1a-b3a7-c1524e7f324c",
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

### Refresh Token

- **URL**: `/api/auth/refresh-token`
- **Method**: `POST`
- **Auth**: None (Public)
- **Description**: Refresh an expired access token using a refresh token
- **Request Body**:
  ```json
  {
    "refreshToken": "a15e7a47-7a8f-4f1a-b3a7-c1524e7f324b"
  }
  ```
- **Response**: Status `200 OK`
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "c35e7a47-7a8f-4f1a-b3a7-c1524e7f324d"
  }
  ```

### Logout

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Auth**: JWT (Bearer Token)
- **Description**: Log out the current user by revoking all their refresh tokens
- **Request Body**: None
- **Response**: Status `200 OK`
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### Get Current User

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth**: JWT (Bearer Token)
- **Description**: Get information about the currently authenticated user
- **Response**: Status `200 OK`
  ```json
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "roles": ["user"]
  }
  ```

## JWT Payload

The JWT token payload contains:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000", // User ID
  "email": "user@example.com",
  "roles": ["user"],
  "permissions": ["user:read"],
  "iat": 1680345600, // Issued at timestamp
  "exp": 1680349200  // Expiration timestamp
}
```

## Authentication Flow

1. **Register**: Create a new user account
2. **Login**: Authenticate and receive tokens
3. **Use API**: Include the access token in the Authorization header
4. **Refresh**: When access token expires, use refresh token to get a new pair
5. **Logout**: Revoke all refresh tokens when finished

## Error Responses

- **401 Unauthorized**: Invalid credentials or token
- **403 Forbidden**: Insufficient permissions
- **400 Bad Request**: Invalid input data

## Security Considerations

- Access tokens expire after 15 minutes
- Refresh tokens are valid for 7 days
- Refresh tokens are single-use (revoked after use)
- All tokens for a user are revoked upon logout