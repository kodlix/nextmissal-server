import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenCommand, RefreshTokenCommandHandler } from './refresh-token.command';
import { AuthService } from '@modules/auth/services/auth.service';
import { IUserRepository } from '@modules/user/repositories/user.repository.interface';
import { IRoleRepository } from '@modules/role/repositories/role.repository.interface';
import { LoggerService } from '@core/logger/logger.service';
import { RefreshToken } from '@modules/auth/entities/refresh-token.entity';
import { User } from '@modules/user/entities/user.entity';
import { Email } from '@core/value-objects/email.vo';
import { FirstName, LastName } from '@core/value-objects/name.vo';
import { UserId } from '@core/value-objects/user-id.vo';
import { Token } from '@core/value-objects/token.vo';
import { Role } from '@modules/role/entities/role.entity';
import { Permission } from '@modules/auth/entities/permission.entity';
import { ResourceAction, ActionType } from '@core/value-objects/resource-action.vo';
import { USER_REPOSITORY, ROLE_REPOSITORY } from '@shared/constants/tokens';

// Mock UUID generation
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('550e8400-e29b-41d4-a716-446655440010'),
}));

// Mock dependencies
const mockUserRepository = {
  findById: jest.fn(),
};

const mockRoleRepository = {
  findById: jest.fn(),
};

const mockAuthService = {
  validateRefreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
  createRefreshToken: jest.fn(),
  isEmailVerified: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('new-access-token'),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      JWT_SECRET: 'test-jwt-secret',
      JWT_ACCESS_EXPIRATION: '15m',
    };

    return config[key];
  }),
};

// Mock Logger
const mockLoggerService = {
  setContext: jest.fn().mockReturnThis(),
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

// Create test data
const createTestUser = (): User => {
  const user = User.create(
    new Email('test@example.com'),
    'hashedPassword',
    new FirstName('John'),
    new LastName('Doe'),
  );

  // Add role - need to use fromData method to set ID
  const role = Role.fromData({
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'user',
    description: 'Regular user role',
    isDefault: true,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  user.addRole(role);

  return user;
};

const createValidRefreshToken = (): RefreshToken => {
  return new RefreshToken(
    UserId.fromString('550e8400-e29b-41d4-a716-446655440000'),
    new Token('550e8400-e29b-41d4-a716-446655440005'), // Use UUID format for token
    7, // 7 days expiration
  );
};

const createRoleWithPermissions = (): Role => {
  const resourceAction = new ResourceAction('user', ActionType.READ);
  const permission = Permission.fromData({
    id: '550e8400-e29b-41d4-a716-446655440002',
    resourceAction,
    description: 'Can read user details',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const role = Role.fromData({
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'user',
    description: 'Regular user role',
    isDefault: true,
    permissions: [permission],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return role;
};

describe('RefreshTokenCommandHandler', () => {
  let handler: RefreshTokenCommandHandler;
  let userRepository: IUserRepository;
  let roleRepository: IRoleRepository;
  let authService: AuthService;
  let jwtService: JwtService;
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  let configService: ConfigService;

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenCommandHandler,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        { provide: ROLE_REPOSITORY, useValue: mockRoleRepository },
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    handler = module.get<RefreshTokenCommandHandler>(RefreshTokenCommandHandler);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY);
    roleRepository = module.get<IRoleRepository>(ROLE_REPOSITORY);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should refresh the token and return new tokens', async () => {
    // Arrange
    const command = new RefreshTokenCommand({
      refreshToken: '550e8400-e29b-41d4-a716-446655440005',
    });

    const user = createTestUser();
    const refreshToken = createValidRefreshToken();
    const roleWithPermissions = createRoleWithPermissions();

    mockAuthService.validateRefreshToken.mockResolvedValue(refreshToken);
    mockUserRepository.findById.mockResolvedValue(user);
    mockRoleRepository.findById.mockResolvedValue(roleWithPermissions);
    mockAuthService.isEmailVerified.mockResolvedValue(true);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: '550e8400-e29b-41d4-a716-446655440010',
    });

    expect(authService.validateRefreshToken).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440005',
    );
    expect(userRepository.findById).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
    expect(authService.revokeRefreshToken).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440005',
    );
    expect(roleRepository.findById).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001');
    expect(authService.isEmailVerified).toHaveBeenCalledWith('test@example.com');

    expect(jwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: user.id.getValue(),
        email: user.email.getValue(),
        emailVerified: true,
        roles: ['user'],
        permissions: ['user:read'],
      }),
      expect.objectContaining({
        secret: 'test-jwt-secret',
        expiresIn: '15m',
      }),
    );

    expect(authService.createRefreshToken).toHaveBeenCalledWith(
      user.id.getValue(),
      '550e8400-e29b-41d4-a716-446655440010',
    );
  });

  it('should throw UnauthorizedException when refresh token is invalid', async () => {
    // Arrange
    const command = new RefreshTokenCommand({
      refreshToken: '550e8400-e29b-41d4-a716-446655440006', // Valid UUID format but not found in DB
    });

    // The token is invalid from the service perspective (not found)
    mockAuthService.validateRefreshToken.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
    expect(authService.validateRefreshToken).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440006',
    );
    expect(userRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when user not found', async () => {
    // Arrange
    const command = new RefreshTokenCommand({
      refreshToken: '550e8400-e29b-41d4-a716-446655440005',
    });

    const refreshToken = createValidRefreshToken();

    mockAuthService.validateRefreshToken.mockResolvedValue(refreshToken);
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
    expect(authService.validateRefreshToken).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440005',
    );
    expect(userRepository.findById).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
    expect(authService.revokeRefreshToken).not.toHaveBeenCalled();
  });

  it('should collect permissions from all user roles', async () => {
    // Arrange
    const command = new RefreshTokenCommand({
      refreshToken: '550e8400-e29b-41d4-a716-446655440005',
    });

    const user = createTestUser();

    // Add another role to the user - mock the eligibility check
    const adminRole = Role.fromData({
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'admin',
      description: 'Administrator role',
      isDefault: false,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mock the eligibility check to allow admin role assignment
    jest.spyOn(user, 'isEligibleForAdminRole').mockReturnValue(true);
    user.addRole(adminRole);

    const refreshToken = createValidRefreshToken();

    // Create roles with permissions for repository responses
    const userRoleWithPermissions = createRoleWithPermissions();

    const adminResourceAction = new ResourceAction('user', ActionType.WRITE);
    const adminPermission = Permission.fromData({
      id: '550e8400-e29b-41d4-a716-446655440004',
      resourceAction: adminResourceAction,
      description: 'Can write user details',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const adminRoleWithPermissions = Role.fromData({
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'admin',
      description: 'Administrator role',
      isDefault: false,
      permissions: [adminPermission],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockAuthService.validateRefreshToken.mockResolvedValue(refreshToken);
    mockUserRepository.findById.mockResolvedValue(user);
    mockAuthService.isEmailVerified.mockResolvedValue(true);

    // Mock repository to return different roles based on role id
    mockRoleRepository.findById.mockImplementation(roleId => {
      if (roleId === '550e8400-e29b-41d4-a716-446655440001') {
        return Promise.resolve(userRoleWithPermissions);
      } else if (roleId === '550e8400-e29b-41d4-a716-446655440003') {
        return Promise.resolve(adminRoleWithPermissions);
      }

      return Promise.resolve(null);
    });

    // Act
    await handler.execute(command);

    // Assert
    // Check that JWT was signed with both permissions
    expect(jwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        permissions: expect.arrayContaining(['user:read', 'user:write']),
      }),
      expect.any(Object),
    );

    // Check that roleRepository.findById was called for both roles
    expect(roleRepository.findById).toHaveBeenCalledTimes(2);
    expect(roleRepository.findById).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001');
    expect(roleRepository.findById).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440003');
  });
});
