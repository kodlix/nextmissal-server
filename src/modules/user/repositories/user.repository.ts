import { Injectable } from '@nestjs/common';
import { User } from '@modules/user/entities/user.entity';
import { IUserRepository } from '@modules/user/repositories/user.repository.interface';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { Role } from '@modules/role/entities/role.entity';
import { Permission } from '@modules/auth/entities/permission.entity';
import {
  User as PrismaUser,
  UserRole as PrismaUserRole,
  RolePermission as PrismaRolePermission,
  Role as PrismaRole,
  Permission as PrismaPermission,
} from '@prisma/client';
import { ResourceAction, ActionType } from '@core/value-objects/resource-action.vo';
import { BaseRepository } from '@core/repositories/base.repository';
import { GetUsersQuery } from '../queries/get-users.query';

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
  async countAll(query: GetUsersQuery): Promise<number> {
    const { search } = query;

    return this.prisma.user.count({
      where: {
        OR: search
          ? [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
    });
  }

  async findById(id: bigint): Promise<User | null> {
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

  async findAll(query: GetUsersQuery): Promise<User[]> {
    const { page, limit, search, sort } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy = sort
      ? {
          [sort.split(':')[0]]: sort.split(':')[1] as 'asc' | 'desc',
        }
      : { createdAt: 'desc' as 'asc' | 'desc' };

    return this.executeWithErrorHandling('findAll', async () => {
      const userRecords = await this.prisma.user.findMany({
        skip,
        take,
        where: {
          OR: search
            ? [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ]
            : undefined,
        },
        orderBy,
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

  async findUsersByRoleId(roleId: number): Promise<User[]> {
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
              role: {
                connect: { id: role.id },
              },
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
              role: {
                connect: { id: role.id },
              },
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

  async delete(id: bigint): Promise<boolean> {
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
    // Map roles first
    const roles = record.roles.map(roleRelation => {
      const roleRecord = roleRelation.role;

      // Map permissions
      const permissions =
        roleRecord.permissions?.map(permissionRelation => {
          const permissionRecord = permissionRelation.permission;

          // Create the ResourceAction value object
          const resourceAction = new ResourceAction(
            permissionRecord.resource,
            permissionRecord.action as ActionType,
          );

          return Permission.fromData({
            id: permissionRecord.id,
            resourceAction,
            description: permissionRecord.description,
            createdAt: permissionRecord.createdAt,
            updatedAt: permissionRecord.updatedAt,
          });
        }) || [];

      return Role.fromData({
        id: roleRecord.id,
        name: roleRecord.name,
        description: roleRecord.description,
        isDefault: roleRecord.isDefault,
        permissions,
        createdAt: roleRecord.createdAt,
        updatedAt: roleRecord.updatedAt,
      });
    });

    return User.fromData({
      id: record.id,
      email: record.email,
      passwordHash: record.passwordHash,
      firstName: record.firstName,
      lastName: record.lastName,
      isActive: record.isActive,
      otpEnabled: record.otpEnabled,
      otpSecret: record.otpSecret || undefined,
      roles,
      lastLoginAt: record.lastLoginAt || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
