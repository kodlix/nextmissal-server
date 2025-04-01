import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoleService } from '@core/services/role.service';
import { RoleDetailResponse } from '@application/dtos/responses/role.response';
import { IRoleRepository } from '@core/repositories/role.repository.interface';
import { Inject } from '@nestjs/common';

export class UpdateRoleCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly isDefault?: boolean,
  ) {}
}

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleCommandHandler implements ICommandHandler<UpdateRoleCommand, RoleDetailResponse> {
  constructor(
    private readonly roleService: RoleService,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<RoleDetailResponse> {
    const { id, name, description, isDefault } = command;
    
    // Update the role
    const role = await this.roleService.updateRole(
      id,
      name,
      description,
      isDefault,
    );

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