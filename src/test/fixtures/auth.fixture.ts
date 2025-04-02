import { User } from '@core/entities/user.entity';
import { Otp } from '@core/entities/otp.entity';
import { RefreshToken } from '@core/entities/refresh-token.entity';
import { EmailVerification } from '@core/entities/email-verification.entity';
import { PasswordReset } from '@core/entities/password-reset.entity';
import { Email } from '@core/value-objects/email.vo';
import { FirstName, LastName } from '@core/value-objects/name.vo';
import { UserId } from '@core/value-objects/user-id.vo';
import { Token } from '@core/value-objects/token.vo';
import { VerificationCode } from '@core/value-objects/verification-code.vo';

/**
 * Test fixtures for auth-related entities
 */
export const authFixtures = {
  // User data
  users: {
    validUser: (): User => {
      const user = new User(
        new Email('test@example.com'),
        'hashedPassword123', // This would be a bcrypt hash in reality
        new FirstName('John'),
        new LastName('Doe'),
        '550e8400-e29b-41d4-a716-446655440000'
      );
      return user;
    },
    
    userWithOtp: (): User => {
      const user = authFixtures.users.validUser();
      user.enableOtp('OTPSECRETBASE32');
      return user;
    },
  },
  
  // OTP data
  otps: {
    validOtp: (): Otp => {
      return new Otp(
        new UserId('550e8400-e29b-41d4-a716-446655440000'),
        'OTPSECRETBASE32',
        5, // 5 minutes expiration
        '550e8400-e29b-41d4-a716-446655440001'
      );
    },
    
    expiredOtp: (): Otp => {
      const otp = authFixtures.otps.validOtp();
      otp.expiresAt = new Date(Date.now() - 60000); // 1 minute ago
      return otp;
    },
    
    verifiedOtp: (): Otp => {
      const otp = authFixtures.otps.validOtp();
      otp.markAsVerified();
      return otp;
    },
  },
  
  // Refresh Token data
  refreshTokens: {
    validToken: (): RefreshToken => {
      return new RefreshToken(
        new UserId('550e8400-e29b-41d4-a716-446655440000'),
        new Token('550e8400-e29b-41d4-a716-446655440002'),
        7, // 7 days expiration
        '550e8400-e29b-41d4-a716-446655440003'
      );
    },
    
    expiredToken: (): RefreshToken => {
      const token = authFixtures.refreshTokens.validToken();
      token.expiresAt = new Date(Date.now() - 86400000); // 1 day ago
      return token;
    },
    
    revokedToken: (): RefreshToken => {
      const token = authFixtures.refreshTokens.validToken();
      token.revoke();
      return token;
    },
  },
  
  // Email Verification data
  emailVerifications: {
    validVerification: (): EmailVerification => {
      return new EmailVerification(
        new Email('test@example.com'),
        new VerificationCode('123456'),
        5, // 5 minutes expiration
        '550e8400-e29b-41d4-a716-446655440004'
      );
    },
    
    expiredVerification: (): EmailVerification => {
      const verification = authFixtures.emailVerifications.validVerification();
      verification.expiresAt = new Date(Date.now() - 60000); // 1 minute ago
      return verification;
    },
    
    verifiedVerification: (): EmailVerification => {
      const verification = authFixtures.emailVerifications.validVerification();
      verification.markAsVerified();
      return verification;
    },
  },
  
  // Password Reset data
  passwordResets: {
    validReset: (): PasswordReset => {
      const reset = new PasswordReset(
        new UserId('550e8400-e29b-41d4-a716-446655440000'),
        new Email('test@example.com'),
        60, // 60 minutes expiration
        '550e8400-e29b-41d4-a716-446655440005'
      );
      // Explicitly set token for testing
      Object.defineProperty(reset, 'token', { 
        value: new Token('550e8400-e29b-41d4-a716-446655440006'),
        writable: true 
      });
      return reset;
    },
    
    expiredReset: (): PasswordReset => {
      const reset = authFixtures.passwordResets.validReset();
      reset.expiresAt = new Date(Date.now() - 60000); // 1 minute ago
      return reset;
    },
    
    usedReset: (): PasswordReset => {
      const reset = authFixtures.passwordResets.validReset();
      reset.markAsUsed();
      return reset;
    },
  },
};