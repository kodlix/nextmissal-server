import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { User } from '@modules/user/entities/user.entity';
import { Email } from '@core/value-objects/email.vo';
import { FirstName, LastName } from '@core/value-objects/name.vo';
import { LoggerService } from '@core/logger/logger.service';
// We're using a mock record instead of the actual Prisma types

// Mock Logger
const mockLoggerService = {
  setContext: jest.fn().mockReturnThis(),
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

// Mock PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userRole: {
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(callback => callback(mockPrismaService)),
};

describe('UserRepository', () => {
  let repository: UserRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      // Arrange
      const userId = BigInt(9999);
      const mockUser = createMockUserRecord(userId);

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: expect.any(Object),
      });
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(userId);
      expect(result.email.getValue()).toBe('test@example.com');
      expect(result.firstName.getValue()).toBe('John');
      expect(result.lastName.getValue()).toBe('Doe');
    });

    it('should return null if user not found', async () => {
      // Arrange
      const userId = BigInt(9999);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: expect.any(Object),
      });
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockUser = createMockUserRecord(BigInt(112), email);

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: expect.any(Object),
      });
      expect(result).toBeInstanceOf(User);
      expect(result.email.getValue()).toBe(email);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const newUser = User.create(
        new Email('test@example.com'),
        'hashedPassword',
        'testuser',
        new FirstName('John'),
        new LastName('Doe'),
        'male',
        undefined,
        undefined,
        true,
        false,
        undefined,
        undefined,
      );

      const mockCreatedUser = createMockUserRecord(newUser.id, newUser.email.getValue());
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await repository.create(newUser);

      // Assert
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          id: newUser.id,
          email: newUser.email.getValue(),
          passwordHash: newUser.passwordHash,
          firstName: newUser.firstName.getValue(),
          lastName: newUser.lastName.getValue(),
        }),
        include: expect.any(Object),
      });
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(newUser.id);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      // Arrange
      const existingUser = User.create(
        new Email('test@example.com'),
        'hashedPassword',
        'testuser',
        new FirstName('John'),
        new LastName('Doe'),
        'male',
        undefined,
        undefined,
        true,
        false,
        undefined,
        undefined,
      );

      const mockUpdatedUser = createMockUserRecord(existingUser.id, existingUser.email.getValue());
      mockPrismaService.userRole.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      // Act
      const result = await repository.update(existingUser);

      // Assert
      expect(prismaService.userRole.deleteMany).toHaveBeenCalledWith({
        where: { userId: existingUser.id },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: existingUser.id },
        data: expect.objectContaining({
          email: existingUser.email.getValue(),
          firstName: existingUser.firstName.getValue(),
          lastName: existingUser.lastName.getValue(),
        }),
        include: expect.any(Object),
      });
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(existingUser.id);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      // Arrange
      const userId = BigInt(1001);
      mockPrismaService.user.delete.mockResolvedValue({ id: userId });

      // Act
      const result = await repository.delete(userId);

      // Assert
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toBe(true);
    });
  });
});

// Helper function to create mock Prisma User records
function createMockUserRecord(id: bigint, email = 'test@example.com') {
  console.log('id in createMockUserRecord:', id.toString(), typeof id);
  return {
    id,
    email,
    passwordHash: 'hashedPassword',
    username: 'testuser',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    isActive: true,
    otpEnabled: false,
    otpSecret: null,
    lastLoginAt: null,
    phoneNumber: null,
    profileImage: null,
    emailVerified: true,
    isFirstLogin: false,
    dateOfBirth: null,
    parishId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [],
  };
}
