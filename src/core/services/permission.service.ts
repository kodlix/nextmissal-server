import { Injectable, Inject } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';
import { IPermissionRepository } from '../repositories/permission.repository.interface';
import {
  EntityNotFoundException,
  EntityAlreadyExistsException,
} from '@core/exceptions/domain-exceptions';
import { ResourceAction, ActionType } from '@core/value-objects/resource-action.vo';
import { PermissionName } from '@core/value-objects/permission-name.vo';

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
      throw new EntityAlreadyExistsException('Permission', 'name');
    }

    // Create ResourceAction value object
    const resourceAction = new ResourceAction(resource, action as ActionType);

    // Create a new permission with the ResourceAction value object
    const permission = new Permission(resourceAction, description);
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
      throw new EntityNotFoundException('Permission', id);
    }

    if (name) {
      const existingPermission = await this.permissionRepository.findByName(name);
      if (existingPermission && existingPermission.id !== id) {
        throw new EntityAlreadyExistsException('Permission', 'name');
      }
      // We'll need to update resourceAction if name changes
      permission.name = PermissionName.create(
        permission.resourceAction.getResource(),
        permission.resourceAction.getAction().toString(),
      );
    }

    if (description) {
      permission.description = description;
    }

    // If either resource or action changes, create a new ResourceAction
    if (resource || action) {
      const newResource = resource || permission.resourceAction.getResource();
      const newAction = (action as ActionType) || permission.resourceAction.getAction();

      const newResourceAction = new ResourceAction(newResource, newAction);
      permission.resourceAction = newResourceAction;

      // Update the name to reflect the new resource and action
      permission.name = PermissionName.create(newResource, newAction.toString());
    }

    permission.updatedAt = new Date();
    return this.permissionRepository.update(permission);
  }

  async deletePermission(id: string): Promise<boolean> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new EntityNotFoundException('Permission', id);
    }

    return this.permissionRepository.delete(id);
  }
}
