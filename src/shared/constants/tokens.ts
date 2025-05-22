// Repository injection tokens
export const USER_REPOSITORY = Symbol('UserRepository');
export const ROLE_REPOSITORY = Symbol('RoleRepository');
export const PERMISSION_REPOSITORY = Symbol('PermissionRepository');
export const REFRESH_TOKEN_REPOSITORY = Symbol('RefreshTokenRepository');
export const OTP_REPOSITORY = Symbol('OtpRepository');
export const EMAIL_VERIFICATION_REPOSITORY = Symbol('EmailVerificationRepository');
export const PASSWORD_RESET_REPOSITORY = Symbol('PasswordResetRepository');
export const FILE_REPOSITORY = Symbol('FileRepository');

// Service injection tokens
export const AUTH_SERVICE = Symbol('AuthService');
export const USER_SERVICE = Symbol('UserService');
export const ROLE_SERVICE = Symbol('RoleService');
export const PERMISSION_SERVICE = Symbol('PermissionService');
export const STORAGE_SERVICE = Symbol('StorageService');
export const THROTTLER_SERVICE = Symbol('ThrottlerService');
