import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@core/logger/logger.service';

// Mocks
import {
  createMockUserRepository,
  createMockOtpRepository,
  createMockRefreshTokenRepository,
  createMockEmailVerificationRepository,
  createMockPasswordResetRepository,
} from '../../../test/mocks/repositories.factory';
import { createMockConfigService } from '../../../test/mocks/config.factory';

// Tokens
import {
  USER_REPOSITORY,
  OTP_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  EMAIL_VERIFICATION_REPOSITORY,
  PASSWORD_RESET_REPOSITORY,
} from '@shared/constants/tokens';

// Fixtures
import { authFixtures } from '../../../test/fixtures/auth.fixtures';

// Exceptions
import {
  EntityNotFoundException,
  OtpExpiredException,
  OtpInvalidException,
  AuthenticationException,
} from '@core/exceptions/domain-exceptions';

// Mock the entire speakeasy module
jest.mock('speakeasy', () => {
  return {
    generateSecret: jest.fn().mockReturnValue({
      base32: 'TEST_SECRET_BASE32',
      otpauth_url: 'otpauth://totp/App:test@example.com?secret=TEST_SECRET_BASE32&issuer=App',
    }),
    totp: jest.fn().mockReturnValue('123456'),
  };
});

// Mock QRCode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,QR_CODE_DATA'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: any;
  let otpRepository: any;
  let refreshTokenRepository: any;
  let emailVerificationRepository: any;
  let passwordResetRepository: any;
  let configService: any;

  // Mock logger
  const mockLoggerService = {
    setContext: jest.fn().mockReturnThis(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    // Create fresh mocks for each test
    userRepository = createMockUserRepository();
    otpRepository = createMockOtpRepository();
    refreshTokenRepository = createMockRefreshTokenRepository();
    emailVerificationRepository = createMockEmailVerificationRepository();
    passwordResetRepository = createMockPasswordResetRepository();
    configService = createMockConfigService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useValue: userRepository },
        { provide: OTP_REPOSITORY, useValue: otpRepository },
        { provide: REFRESH_TOKEN_REPOSITORY, useValue: refreshTokenRepository },
        { provide: EMAIL_VERIFICATION_REPOSITORY, useValue: emailVerificationRepository },
        { provide: PASSWORD_RESET_REPOSITORY, useValue: passwordResetRepository },
        { provide: ConfigService, useValue: configService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Mock methods that use external libraries
    service.verifyOtp = jest.fn().mockResolvedValue(true);
    service.verifyTwoFactorToken = jest.fn().mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRefreshToken', () => {
    it('should create a refresh token', async () => {
      // Arrange
      const userId = BigInt(500);
      const token = '550e8400-e29b-41d4-a716-446655440002';

      // Act
      const result = await service.createRefreshToken(userId, token);

      // Assert
      expect(refreshTokenRepository.deleteByUserId).toHaveBeenCalledWith(userId);
      expect(refreshTokenRepository.create).toHaveBeenCalled();
      expect(result.userId).toBe(userId);
      expect(result.token.getValue()).toBe(token);
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate a valid refresh token', async () => {
      // Arrange
      const token = '550e8400-e29b-41d4-a716-446655440002';
      const refreshToken = authFixtures.refreshTokens.validToken();

      refreshTokenRepository.findByToken.mockResolvedValue(refreshToken);

      // Act
      const result = await service.validateRefreshToken(token);

      // Assert
      expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(refreshToken);
    });

    it('should throw AuthenticationException for non-existent token', async () => {
      // Arrange
      const token = 'non-existent-token';
      refreshTokenRepository.findByToken.mockResolvedValue(null);

      // Act & Assert
      await expect(service.validateRefreshToken(token)).rejects.toThrow(AuthenticationException);
      expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(token);
    });

    it('should throw AuthenticationException for expired token', async () => {
      // Arrange
      const token = '550e8400-e29b-41d4-a716-446655440002';
      const expiredToken = authFixtures.refreshTokens.expiredToken();

      refreshTokenRepository.findByToken.mockResolvedValue(expiredToken);

      // Act & Assert
      await expect(service.validateRefreshToken(token)).rejects.toThrow(AuthenticationException);
      expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(token);
    });

    it('should throw AuthenticationException for revoked token', async () => {
      // Arrange
      const token = '550e8400-e29b-41d4-a716-446655440002';
      const revokedToken = authFixtures.refreshTokens.revokedToken();

      refreshTokenRepository.findByToken.mockResolvedValue(revokedToken);

      // Act & Assert
      await expect(service.validateRefreshToken(token)).rejects.toThrow(AuthenticationException);
      expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(token);
    });
  });

  describe('generateEmailVerificationCode', () => {
    it('should generate email verification code', async () => {
      // Arrange
      const email = 'test@example.com';

      // Mock Math.random to get consistent result
      const mockRandom = jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

      // Act
      const result = await service.generateEmailVerificationCode(email);

      // Assert
      expect(emailVerificationRepository.deleteByEmail).toHaveBeenCalledWith(email);
      expect(emailVerificationRepository.create).toHaveBeenCalled();
      expect(result).toBe('550000'); // Based on our mocked Math.random

      // Restore Math.random
      mockRandom.mockRestore();
    });
  });

  describe('verifyEmailCode', () => {
    it('should verify a valid email code', async () => {
      // Arrange
      const email = 'test@example.com';
      const code = '123456';
      const verification = authFixtures.emailVerifications.validVerification();

      emailVerificationRepository.findByEmailAndCode.mockResolvedValue(verification);

      // Act
      const result = await service.verifyEmailCode(email, code);

      // Assert
      expect(emailVerificationRepository.findByEmailAndCode).toHaveBeenCalledWith(email, code);
      expect(emailVerificationRepository.update).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw OtpInvalidException for non-existent verification', async () => {
      // Arrange
      const email = 'test@example.com';
      const code = '123456';

      emailVerificationRepository.findByEmailAndCode.mockResolvedValue(null);

      // Act & Assert
      await expect(service.verifyEmailCode(email, code)).rejects.toThrow(OtpInvalidException);
      expect(emailVerificationRepository.findByEmailAndCode).toHaveBeenCalledWith(email, code);
    });

    it('should throw OtpExpiredException for expired verification', async () => {
      // Arrange
      const email = 'test@example.com';
      const code = '123456';
      const expiredVerification = authFixtures.emailVerifications.expiredVerification();

      emailVerificationRepository.findByEmailAndCode.mockResolvedValue(expiredVerification);

      // Act & Assert
      await expect(service.verifyEmailCode(email, code)).rejects.toThrow(OtpExpiredException);
      expect(emailVerificationRepository.findByEmailAndCode).toHaveBeenCalledWith(email, code);
    });
  });

  describe('updateLastLogin', () => {
    it('should update last login', async () => {
      // Arrange
      const userId = BigInt(500);
      const user = authFixtures.users.validUser();

      userRepository.findById.mockResolvedValue(user);

      // Act
      const result = await service.updateLastLogin(userId);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.update).toHaveBeenCalled();
      expect(result.lastLoginAt).toBeInstanceOf(Date);
    });

    it('should throw EntityNotFoundException for non-existent user', async () => {
      // Arrange
      const userId = BigInt(5000002200);

      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateLastLogin(userId)).rejects.toThrow(EntityNotFoundException);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });
});
