import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RoleService } from '@core/services/role.service';
import { RoleDetailResponse } from '@application/dtos/responses/role.response';
import { IRoleRepository } from '@core/repositories/role.repository.interface';
import { RoleMapper } from '@application/mappers/role.mapper';

export class CreateRoleCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly isDefault?: boolean,
    public readonly permissionIds?: string[],
  ) {}
}

@CommandHandler(CreateRoleCommand)
export class CreateRoleCommandHandler implements ICommandHandler<CreateRoleCommand, RoleDetailResponse> {
  constructor(
    private readonly roleService: RoleService,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: CreateRoleCommand): Promise<RoleDetailResponse> {
    const { name, description, isDefault, permissionIds } = command;
    
    // Create the role first
    const role = await this.roleService.createRole(
      name,
      description,
      isDefault,
    );

    // If permission IDs are provided, assign them to the role
    if (permissionIds && permissionIds.length > 0) {
      for (const permissionId of permissionIds) {
        await this.roleService.assignPermissionToRole(role.id, permissionId);
      }
    }

    // Get the updated role with permissions
    const updatedRole = await this.roleRepository.findById(role.id);

    // Use the mapper to convert to response DTO
    return RoleMapper.toDetailResponse(updatedRole);
  }
}