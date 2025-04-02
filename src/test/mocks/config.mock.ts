import { ConfigService } from '@nestjs/config';

/**
 * Creates a mock for the NestJS ConfigService
 */
export const createMockConfigService = (): { get: jest.Mock<any, any, any> } => ({
  get: jest.fn().mockImplementation((key: string, defaultValue?: any) => {
    const config = {
      // OTP config
      OTP_SECRET: 'test-otp-secret',
      OTP_EXPIRATION: 5,
      OTP_STEP: 30,
      OTP_DIGITS: 6,

      // JWT config
      JWT_SECRET: 'test-jwt-secret',
      JWT_ACCESS_EXPIRATION: '15m',
      JWT_REFRESH_EXPIRATION: '7d',

      // App config
      NODE_ENV: 'test',
      PORT: 3000,
    };

    return config[key] ?? defaultValue;
  }),
});
