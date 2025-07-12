// User response interfaces

export interface IUserRoleResponse {
  id: bigint;
  name: string;
}

export interface IUserBaseResponse {
  id: bigint;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified?: boolean;
}

export interface IUserDetailResponse extends IUserBaseResponse {
  isActive: boolean;
  otpEnabled: boolean;
  lastLoginAt?: Date;
  roles: IUserRoleResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithAuthResponse extends IUserBaseResponse {
  roles: IUserRoleResponse[];
}

export interface IAuthTokenResponse {
  userId: bigint;
  accessToken: string;
  refreshToken: string;
  user: IUserWithAuthResponse;
}

export interface IOtpRequiredResponse {
  requiresOtp: true;
  userid: bigint;
  message: string;
}

export interface IEmailVerificationRequiredResponse {
  requiresEmailVerification?: true;
  userId: bigint;
  email: string;
  message: string;
}

export interface IAuthRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtPayload {
  sub: bigint;
  email: string;
  emailVerified?: boolean;
  roles: string[];
  permissions?: string[];
  iat?: number;
  exp?: number;
}

export type AuthResponse =
  | IAuthTokenResponse
  | IOtpRequiredResponse
  | IEmailVerificationRequiredResponse;
