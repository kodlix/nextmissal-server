import { Injectable } from '@nestjs/common';
import { User } from '@core/entities/user.entity';
import { IUserRepository } from '@core/repositories/user.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { Role } from '@core/entities/role.entity';
import { Permission } from '@core/entities/permission.entity';
import {
  User as PrismaUser,
  UserRole as PrismaUserRole,
  RolePermission as PrismaRolePermission,
  Role as PrismaRole,
  Permission as PrismaPermission,
} from '@prisma/client';
import { Email } from '@core/value-objects/email.vo';
import { FirstName, LastName } from '@core/value-objects/name.vo';
import { ResourceAction, ActionType } from '@core/value-objects/resource-action.vo';
import { BaseRepository } from './base.repository';

// Define a type for User with its relations (roles with nested permissions)
type UserWithRelations = PrismaUser & {
  roles: (PrismaUserRole & {
    role: PrismaRole & {
      permissions: (PrismaRolePermission & {
        permission: PrismaPermission;
      })[];
    };
  })[];
};

@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    return this.executeWithErrorHandling('findById', async () => {
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
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.executeWithErrorHandling('findByEmail', async () => {
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
    });
  }

  async findAll(): Promise<User[]> {
    return this.executeWithErrorHandling('findAll', async () => {
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
    });
  }

  async findUsersByRoleId(roleId: string): Promise<User[]> {
    return this.executeWithErrorHandling('findUsersByRoleId', async () => {
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
    });
  }

  async create(user: User): Promise<User> {
    return this.executeWithErrorHandling('create', async () => {
      const createdUser = await this.prisma.user.create({
        data: {
          id: user.id,
          email: user.email.getValue(),
          passwordHash: user.passwordHash,
          firstName: user.firstName.getValue(),
          lastName: user.lastName.getValue(),
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
    });
  }

  async update(user: User): Promise<User> {
    return this.executeWithErrorHandling('update', async () => {
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
          email: user.email.getValue(),
          passwordHash: user.passwordHash,
          firstName: user.firstName.getValue(),
          lastName: user.lastName.getValue(),
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
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.executeWithErrorHandling(
      'delete',
      async () => {
        await this.prisma.user.delete({
          where: { id },
        });
        return true;
      },
      false,
    );
  }

  private mapToModel(record: UserWithRelations): User {
    // Create value objects from primitive values
    const emailVO = new Email(record.email);
    const firstNameVO = new FirstName(record.firstName);
    const lastNameVO = new LastName(record.lastName);

    const user = new User(emailVO, record.passwordHash, firstNameVO, lastNameVO);

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
      const role = new Role(roleRecord.name, roleRecord.description, roleRecord.isDefault);

      role.id = roleRecord.id;
      role.createdAt = roleRecord.createdAt;
      role.updatedAt = roleRecord.updatedAt;

      // Map permissions
      if (roleRecord.permissions) {
        role.permissions = roleRecord.permissions.map(permissionRelation => {
          const permissionRecord = permissionRelation.permission;

          // Create the ResourceAction value object
          const resourceAction = new ResourceAction(
            permissionRecord.resource,
            permissionRecord.action as ActionType,
          );

          // Create the Permission entity with the value object
          const permission = new Permission(
            resourceAction,
            permissionRecord.description,
            permissionRecord.id,
          );

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
