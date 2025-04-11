import { Injectable, Inject } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { IRoleRepository } from '../repositories/role.repository.interface';
import { IPermissionRepository } from '../repositories/permission.repository.interface';
import {
  EntityNotFoundException,
  EntityAlreadyExistsException,
  ForbiddenActionException,
} from '@core/exceptions/domain-exceptions';

@Injectable()
export class RoleService {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
    @Inject('PermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async createRole(name: string, description: string, isDefault: boolean = false): Promise<Role> {
    // Check if a role already exists
    const existingRole = await this.roleRepository.findByName(name);
    if (existingRole) {
      throw new EntityAlreadyExistsException('Role', 'name');
    }

    // If this is a default role, unset any existing default role
    if (isDefault) {
      const currentDefaultRole = await this.roleRepository.findDefaultRole();
      if (currentDefaultRole) {
        currentDefaultRole.setDefault(false);
        await this.roleRepository.update(currentDefaultRole);
      }
    }

    const role = new Role(name, description, isDefault);

    return this.roleRepository.create(role);
  }

  async updateRole(
    id: string,
    name?: string,
    description?: string,
    isDefault?: boolean,
  ): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new EntityNotFoundException('Role', id);
    }

    if (name) {
      const existingRole = await this.roleRepository.findByName(name);
      if (existingRole && existingRole.id !== id) {
        throw new EntityAlreadyExistsException('Role', 'name');
      }
      role.name = name;
    }

    if (description) {
      role.description = description;
    }

    if (isDefault !== undefined) {
      // If making this role default, unset any existing default role
      if (isDefault && !role.isDefault) {
        const currentDefaultRole = await this.roleRepository.findDefaultRole();
        if (currentDefaultRole && currentDefaultRole.id !== id) {
          currentDefaultRole.setDefault(false);
          await this.roleRepository.update(currentDefaultRole);
        }
      }
      role.setDefault(isDefault);
    }

    role.updatedAt = new Date();

    return this.roleRepository.update(role);
  }

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new EntityNotFoundException('Role', roleId);
    }

    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission) {
      throw new EntityNotFoundException('Permission', permissionId);
    }

    role.addPermission(permission);

    return this.roleRepository.update(role);
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new EntityNotFoundException('Role', roleId);
    }

    role.removePermission(permissionId);

    return this.roleRepository.update(role);
  }

  async deleteRole(id: string): Promise<boolean> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new EntityNotFoundException('Role', id);
    }

    if (role.isDefault) {
      throw new ForbiddenActionException('Cannot delete the default role');
    }

    return this.roleRepository.delete(id);
  }
}
