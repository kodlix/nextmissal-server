import { Injectable, Inject } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';
import { IPermissionRepository } from '../repositories/permission.repository.interface';

@Injectable()
export class PermissionService {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async createPermission(
    name: string,
    description: string,
    resource: string,
    action: string,
  ): Promise<Permission> {
    // Check if permission already exists
    const existingPermission = await this.permissionRepository.findByName(name);
    if (existingPermission) {
      throw new Error('Permission with this name already exists');
    }

    const permission = new Permission(name, description, resource, action);
    return this.permissionRepository.create(permission);
  }

  async updatePermission(
    id: string,
    name?: string,
    description?: string,
    resource?: string,
    action?: string,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new Error('Permission not found');
    }

    if (name) {
      const existingPermission = await this.permissionRepository.findByName(name);
      if (existingPermission && existingPermission.id !== id) {
        throw new Error('Permission with this name already exists');
      }
      permission.name = name;
    }

    if (description) {
      permission.description = description;
    }

    if (resource) {
      permission.resource = resource;
    }

    if (action) {
      permission.action = action;
    }

    permission.updatedAt = new Date();
    return this.permissionRepository.update(permission);
  }

  async deletePermission(id: string): Promise<boolean> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new Error('Permission not found');
    }

    return this.permissionRepository.delete(id);
  }
}