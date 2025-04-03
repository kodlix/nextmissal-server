/**
 * Login credentials fixture for tests
 */
export const loginCredentialsFixture = {
  email: 'test@example.com',
  password: 'Password123!',
};

/**
 * Registration data fixture for tests
 */
export const registrationDataFixture = {
  email: 'new-user@example.com',
  password: 'Password123!',
  firstName: 'New',
  lastName: 'User',
};

/**
 * JWT tokens fixture for tests
 */
export const tokensFixture = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIl0sInBlcm1pc3Npb25zIjpbInVzZXI6cmVhZCJdLCJpYXQiOjE2OTgwMDAwMDAsImV4cCI6MTY5ODAwMzYwMH0.mJN5dCwhA9GjQvdS8vnKKlvsCmkFjKK91LEDx1wUuO4',
  refreshToken: '550e8400-e29b-41d4-a716-446655440000',
};

/**
 * 2FA setup fixture for tests
 */
export const twoFactorSetupFixture = {
  otpAuthUrl: 'otpauth://totp/NestJSTemplate:test@example.com?secret=AAABBBCCCDDDEEEFFFGGG&period=30&digits=6&algorithm=SHA1',
  secret: 'AAABBBCCCDDDEEEFFFGGG',
};

/**
 * Email verification fixture for tests
 */
export const emailVerificationFixture = {
  email: 'test@example.com',
  code: 'ABC123',
};