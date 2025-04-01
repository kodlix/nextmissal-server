// User response interfaces

export interface UserRoleResponse {
  id: string;
  name: string;
}

export interface UserBaseResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified?: boolean;
}

export interface UserDetailResponse extends UserBaseResponse {
  isActive: boolean;
  otpEnabled: boolean;
  lastLoginAt?: Date;
  roles: UserRoleResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithAuthResponse extends UserBaseResponse {
  roles: UserRoleResponse[];
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: UserWithAuthResponse;
}

export interface OtpRequiredResponse {
  requiresOtp: true;
  userId: string;
  message: string;
}

export interface EmailVerificationRequiredResponse {
  requiresEmailVerification: true;
  userId: string;
  email: string;
  message: string;
}

export interface AuthRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  emailVerified?: boolean;
  roles: string[];
  permissions?: string[];
  iat?: number;
  exp?: number;
}

export type AuthResponse = AuthTokenResponse | OtpRequiredResponse | EmailVerificationRequiredResponse;