import { Injectable } from '@nestjs/common';
import { User } from '@core/entities/user.entity';
import { IUserRepository } from '@core/repositories/user.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { Role } from '@core/entities/role.entity';
import { Permission } from '@core/entities/permission.entity';
import { Prisma, User as PrismaUser, UserRole as PrismaUserRole, RolePermission as PrismaRolePermission, Role as PrismaRole, Permission as PrismaPermission } from '@prisma/client';

// Define a type for User with its relations (roles with nested permissions)
type UserWithRelations = PrismaUser & {
  roles: (PrismaUserRole & {
    role: PrismaRole & {
      permissions: (PrismaRolePermission & {
        permission: PrismaPermission
      })[]
    }
  })[]
};

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const userRecord = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userRecord) {
      return null;
    }

    return this.mapToModel(userRecord as UserWithRelations);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userRecord = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userRecord) {
      return null;
    }

    return this.mapToModel(userRecord as UserWithRelations);
  }

  async findAll(): Promise<User[]> {
    const userRecords = await this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return userRecords.map(record => this.mapToModel(record as UserWithRelations));
  }

  async findUsersByRoleId(roleId: string): Promise<User[]> {
    const userRecords = await this.prisma.user.findMany({
      where: {
        roles: {
          some: {
            roleId,
          },
        },
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return userRecords.map(record => this.mapToModel(record as UserWithRelations));
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        otpEnabled: user.otpEnabled,
        otpSecret: user.otpSecret,
        lastLoginAt: user.lastLoginAt,
        roles: {
          create: user.roles.map(role => ({
            roleId: role.id,
          })),
        },
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.mapToModel(createdUser as UserWithRelations);
  }

  async update(user: User): Promise<User> {
    // First, delete all role associations to recreate them
    await this.prisma.userRole.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Update the user with new role associations
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        otpEnabled: user.otpEnabled,
        otpSecret: user.otpSecret,
        lastLoginAt: user.lastLoginAt,
        roles: {
          create: user.roles.map(role => ({
            roleId: role.id,
          })),
        },
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.mapToModel(updatedUser as UserWithRelations);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToModel(record: UserWithRelations): User {
    const user = new User(
      record.email,
      record.passwordHash,
      record.firstName,
      record.lastName,
    );

    user.id = record.id;
    user.isActive = record.isActive;
    user.otpEnabled = record.otpEnabled;
    user.otpSecret = record.otpSecret || undefined;
    user.lastLoginAt = record.lastLoginAt || undefined;
    user.createdAt = record.createdAt;
    user.updatedAt = record.updatedAt;

    // Map roles
    user.roles = record.roles.map(roleRelation => {
      const roleRecord = roleRelation.role;
      const role = new Role(
        roleRecord.name,
        roleRecord.description,
        roleRecord.isDefault,
      );

      role.id = roleRecord.id;
      role.createdAt = roleRecord.createdAt;
      role.updatedAt = roleRecord.updatedAt;

      // Map permissions
      if (roleRecord.permissions) {
        role.permissions = roleRecord.permissions.map(permissionRelation => {
          const permissionRecord = permissionRelation.permission;
          const permission = new Permission(
            permissionRecord.name,
            permissionRecord.description,
            permissionRecord.resource,
            permissionRecord.action,
          );

          permission.id = permissionRecord.id;
          permission.createdAt = permissionRecord.createdAt;
          permission.updatedAt = permissionRecord.updatedAt;

          return permission;
        });
      }

      return role;
    });

    return user;
  }
}
