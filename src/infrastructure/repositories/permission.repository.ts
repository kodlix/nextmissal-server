import { Injectable } from '@nestjs/common';
import { Permission } from '@core/entities/permission.entity';
import { IPermissionRepository } from '@core/repositories/permission.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { Permission as PrismaPermission } from '@prisma/client';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Permission | null> {
    const permissionRecord = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permissionRecord) {
      return null;
    }

    return this.mapToModel(permissionRecord as unknown as PrismaPermission);
  }

  async findByName(name: string): Promise<Permission | null> {
    const permissionRecord = await this.prisma.permission.findUnique({
      where: { name },
    });

    if (!permissionRecord) {
      return null;
    }

    return this.mapToModel(permissionRecord as unknown as PrismaPermission);
  }

  async findAll(): Promise<Permission[]> {
    const permissionRecords = await this.prisma.permission.findMany();
    return permissionRecords.map(record => this.mapToModel(record as unknown as PrismaPermission));
  }

  async findByResource(resource: string): Promise<Permission[]> {
    const permissionRecords = await this.prisma.permission.findMany({
      where: { resource },
    });
    return permissionRecords.map(record => this.mapToModel(record as unknown as PrismaPermission));
  }

  async create(permission: Permission): Promise<Permission> {
    const createdPermission = await this.prisma.permission.create({
      data: {
        id: permission.id,
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
        action: permission.action,
      },
    });

    return this.mapToModel(createdPermission as unknown as PrismaPermission);
  }

  async update(permission: Permission): Promise<Permission> {
    const updatedPermission = await this.prisma.permission.update({
      where: { id: permission.id },
      data: {
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
        action: permission.action,
      },
    });

    return this.mapToModel(updatedPermission as unknown as PrismaPermission);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.permission.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToModel(record: PrismaPermission): Permission {
    const permission = new Permission(
      record.name,
      record.description,
      record.resource,
      record.action,
    );
    
    permission.id = record.id;
    permission.createdAt = record.createdAt;
    permission.updatedAt = record.updatedAt;
    
    return permission;
  }
}