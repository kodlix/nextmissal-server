import { Injectable } from '@nestjs/common';
import { Role } from '@modules/role/entities/role.entity';
import { Permission } from '@modules/auth/entities/permission.entity';
import { IRoleRepository } from '@modules/role/repositories/role.repository.interface';
import { PrismaService } from '@core/database/prisma/prisma.service';
import {
  Role as PrismaRole,
  RolePermission as PrismaRolePermission,
  Permission as PrismaPermission,
} from '@prisma/client';
import { ResourceAction, ActionType } from '@core/value-objects/resource-action.vo';
import { BaseRepository } from '@core/repositories/base.repository';

// Define a type for Role with its related permissions
type RoleWithPermissions = PrismaRole & {
  permissions?: (PrismaRolePermission & {
    permission: PrismaPermission;
  })[];
};

@Injectable()
export class RoleRepository extends BaseRepository<Role> implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async countAll(search?: string): Promise<number> {
    return this.prisma.role.count({
      where: {
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
    });
  }

  async findById(id: bigint): Promise<Role | null> {
    const roleRecord = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!roleRecord) {
      return null;
    }

    return this.mapToModel(roleRecord as RoleWithPermissions);
  }

  async findByName(name: string): Promise<Role | null> {
    const roleRecord = await this.prisma.role.findUnique({
      where: { name },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!roleRecord) {
      return null;
    }

    return this.mapToModel(roleRecord as RoleWithPermissions);
  }

  async findAll(page: number, limit: number, search?: string, sort?: string): Promise<Role[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy = sort
      ? {
          [sort.split(':')[0]]: sort.split(':')[1] as 'asc' | 'desc',
        }
      : { createdAt: 'desc' as 'asc' | 'desc' };

    const roleRecords = await this.prisma.role.findMany({
      skip,
      take,
      where: {
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy,
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return roleRecords.map(record => this.mapToModel(record as RoleWithPermissions));
  }

  async findDefaultRole(): Promise<Role | null> {
    const roleRecord = await this.prisma.role.findFirst({
      where: { isDefault: true },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!roleRecord) {
      return null;
    }

    return this.mapToModel(roleRecord as RoleWithPermissions);
  }

  async create(role: Role): Promise<Role> {
    const createdRole = await this.prisma.role.create({
      data: {
        id: role.id,
        name: role.name,
        description: role.description,
        isDefault: role.isDefault,
        permissions: {
          create:
            role.permissions?.map(permission => ({
              permission: {
                connect: { id: permission.id },
              },
            })) || [],
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return this.mapToModel(createdRole as RoleWithPermissions);
  }

  async update(role: Role): Promise<Role> {
    // First delete all permission associations to recreate them
    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId: role.id,
      },
    });

    // Update the role with new permission associations
    const updatedRole = await this.prisma.role.update({
      where: { id: role.id },
      data: {
        name: role.name,
        description: role.description,
        isDefault: role.isDefault,
        permissions: {
          create:
            role.permissions?.map(permission => ({
              permission: {
                connect: { id: permission.id },
              },
            })) || [],
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return this.mapToModel(updatedRole as RoleWithPermissions);
  }

  async delete(id: bigint): Promise<boolean> {
    try {
      await this.prisma.role.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }

  private mapToModel(record: RoleWithPermissions): Role {
    // Map permissions first
    const permissions =
      record.permissions?.map(permissionRelation => {
        const permissionRecord = permissionRelation.permission;

        // Create ResourceAction value object
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
      id: record.id,
      name: record.name,
      description: record.description,
      isDefault: record.isDefault,
      permissions,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
