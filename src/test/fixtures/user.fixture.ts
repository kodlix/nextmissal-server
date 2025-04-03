/**
 * User fixture for tests
 */
export const userFixture = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
  password: 'hashedPassword123!',
  firstName: 'Test',
  lastName: 'User',
  isActive: true,
  roles: ['user'],
  permissions: ['user:read'],
};

/**
 * Admin fixture for tests
 */
export const adminFixture = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'admin@example.com',
  password: 'hashedPassword123!',
  firstName: 'Admin',
  lastName: 'User',
  isActive: true,
  roles: ['admin'],
  permissions: ['user:read', 'user:write', 'user:delete', 'role:read', 'role:write', 'role:delete'],
};