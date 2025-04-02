import { IUserRepository } from '@core/repositories/user.repository.interface';
import { IOtpRepository } from '@core/repositories/otp.repository.interface';
import { IRefreshTokenRepository } from '@core/repositories/refresh-token.repository.interface';
import { IEmailVerificationRepository } from '@core/repositories/email-verification.repository.interface';
import { IPasswordResetRepository } from '@core/repositories/password-reset.repository.interface';
import { IPermissionRepository } from '@core/repositories/permission.repository.interface';
import { IRoleRepository } from '@core/repositories/role.repository.interface';

/**
 * Creates a mock repository with common repository methods
 */
export const createMockRepository = <T>() => ({
  create: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
  findById: jest.fn().mockImplementation((id) => Promise.resolve(null)),
  findAll: jest.fn().mockImplementation(() => Promise.resolve([])),
  update: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
  delete: jest.fn().mockImplementation((id) => Promise.resolve(true)),
});

/**
 * Creates a mock user repository
 */
export const createMockUserRepository = (): {
  create: jest.Mock<any, any, any>;
  findById: jest.Mock<any, any, any>;
  findAll: jest.Mock<any, any, any>;
  update: jest.Mock<any, any, any>;
  delete: jest.Mock<any, any, any>;
  findByEmail: jest.Mock<any, any, any>;
  findByIds: jest.Mock<any, any, any>;
  findWithRoles: jest.Mock<any, any, any>;
  addRole: jest.Mock<any, any, any>;
  removeRole: jest.Mock<any, any, any>
} => ({
  ...createMockRepository(),
  findByEmail: jest.fn().mockImplementation((email) => Promise.resolve(null)),
  findByIds: jest.fn().mockImplementation((ids) => Promise.resolve([])),
  findWithRoles: jest.fn().mockImplementation((id) => Promise.resolve(null)),
  addRole: jest.fn().mockImplementation((userId, roleId) => Promise.resolve(true)),
  removeRole: jest.fn().mockImplementation((userId, roleId) => Promise.resolve(true)),
});

/**
 * Creates a mock OTP repository
 */
export const createMockOtpRepository = (): {
  create: jest.Mock<any, any, any>;
  findById: jest.Mock<any, any, any>;
  findAll: jest.Mock<any, any, any>;
  update: jest.Mock<any, any, any>;
  delete: jest.Mock<any, any, any>;
  findByUserId: jest.Mock<any, any, any>;
  deleteByUserId: jest.Mock<any, any, any>
} => ({
  ...createMockRepository(),
  findByUserId: jest.fn().mockImplementation((userId) => Promise.resolve(null)),
  deleteByUserId: jest.fn().mockImplementation((userId) => Promise.resolve(true)),
});

/**
 * Creates a mock refresh token repository
 */
export const createMockRefreshTokenRepository = (): {
  create: jest.Mock<any, any, any>;
  findById: jest.Mock<any, any, any>;
  findAll: jest.Mock<any, any, any>;
  update: jest.Mock<any, any, any>;
  delete: jest.Mock<any, any, any>;
  findByToken: jest.Mock<any, any, any>;
  deleteByUserId: jest.Mock<any, any, any>;
  revokeByUserId: jest.Mock<any, any, any>
} => ({
  ...createMockRepository(),
  findByToken: jest.fn().mockImplementation((token) => Promise.resolve(null)),
  deleteByUserId: jest.fn().mockImplementation((userId) => Promise.resolve(true)),
  revokeByUserId: jest.fn().mockImplementation((userId) => Promise.resolve(true)),
});

/**
 * Creates a mock email verification repository
 */
export const createMockEmailVerificationRepository = (): jest.Mocked<IEmailVerificationRepository> => ({
  ...createMockRepository(),
  findByEmail: jest.fn().mockImplementation((email) => Promise.resolve(null)),
  findByEmailAndCode: jest.fn().mockImplementation((email, code) => Promise.resolve(null)),
  deleteByEmail: jest.fn().mockImplementation((email) => Promise.resolve(true)),
});

/**
 * Creates a mock password reset repository
 */
export const createMockPasswordResetRepository = (): {
  create: jest.Mock<any, any, any>;
  findById: jest.Mock<any, any, any>;
  findAll: jest.Mock<any, any, any>;
  update: jest.Mock<any, any, any>;
  delete: jest.Mock<any, any, any>;
  findByToken: jest.Mock<any, any, any>;
  findByUserId: jest.Mock<any, any, any>;
  deleteByUserId: jest.Mock<any, any, any>
} => ({
  ...createMockRepository(),
  findByToken: jest.fn().mockImplementation((token) => Promise.resolve(null)),
  findByUserId: jest.fn().mockImplementation((userId) => Promise.resolve(null)),
  deleteByUserId: jest.fn().mockImplementation((userId) => Promise.resolve(true)),
});

/**
 * Creates a mock role repository
 */
export const createMockRoleRepository = (): {
  create: jest.Mock<any, any, any>;
  findById: jest.Mock<any, any, any>;
  findAll: jest.Mock<any, any, any>;
  update: jest.Mock<any, any, any>;
  delete: jest.Mock<any, any, any>;
  findByName: jest.Mock<any, any, any>;
  findByNames: jest.Mock<any, any, any>;
  findWithPermissions: jest.Mock<any, any, any>;
  addPermission: jest.Mock<any, any, any>;
  removePermission: jest.Mock<any, any, any>;
  findDefaultRole: jest.Mock<any, any, any>
} => ({
  ...createMockRepository(),
  findByName: jest.fn().mockImplementation((name) => Promise.resolve(null)),
  findByNames: jest.fn().mockImplementation((names) => Promise.resolve([])),
  findWithPermissions: jest.fn().mockImplementation((id) => Promise.resolve(null)),
  addPermission: jest.fn().mockImplementation((roleId, permissionId) => Promise.resolve(true)),
  removePermission: jest.fn().mockImplementation((roleId, permissionId) => Promise.resolve(true)),
  findDefaultRole: jest.fn().mockImplementation(() => Promise.resolve(null)),
});

/**
 * Creates a mock permission repository
 */
export const createMockPermissionRepository = (): {
  create: jest.Mock<any, any, any>;
  findById: jest.Mock<any, any, any>;
  findAll: jest.Mock<any, any, any>;
  update: jest.Mock<any, any, any>;
  delete: jest.Mock<any, any, any>;
  findByName: jest.Mock<any, any, any>;
  findByResource: jest.Mock<any, any, any>;
  findByAction: jest.Mock<any, any, any>;
  findByResourceAndAction: jest.Mock<any, any, any>
} => ({
  ...createMockRepository(),
  findByName: jest.fn().mockImplementation((name) => Promise.resolve(null)),
  findByResource: jest.fn().mockImplementation((resource) => Promise.resolve([])),
  findByAction: jest.fn().mockImplementation((action) => Promise.resolve([])),
  findByResourceAndAction: jest.fn().mockImplementation((resource, action) => Promise.resolve(null)),
});
