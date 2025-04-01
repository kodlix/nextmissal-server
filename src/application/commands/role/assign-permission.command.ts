import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoleService } from '@core/services/role.service';
import { RoleDetailResponse } from '@application/dtos/responses/role.response';
import { IRoleRepository } from '@core/repositories/role.repository.interface';
import { Inject } from '@nestjs/common';

export class AssignPermissionCommand {
  constructor(
    public readonly roleId: string,
    public readonly permissionId: string,
  ) {}
}

@CommandHandler(AssignPermissionCommand)
export class AssignPermissionCommandHandler implements ICommandHandler<AssignPermissionCommand, RoleDetailResponse> {
  constructor(
    private readonly roleService: RoleService,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: AssignPermissionCommand): Promise<RoleDetailResponse> {
    const { roleId, permissionId } = command;
    
    // Assign the permission to the role
    const role = await this.roleService.assignPermissionToRole(roleId, permissionId);
    
    // Fetch the updated role with permissions
    const updatedRole = await this.roleRepository.findById(role.id);

    return {
      id: updatedRole.id,
      name: updatedRole.name,
      description: updatedRole.description,
      isDefault: updatedRole.isDefault,
      permissions: updatedRole.permissions?.map(permission => ({
        id: permission.id,
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
        action: permission.action,
      })) || [],
      createdAt: updatedRole.createdAt,
      updatedAt: updatedRole.updatedAt,
    };
  }
}