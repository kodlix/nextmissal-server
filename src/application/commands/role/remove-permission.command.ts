import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoleService } from '@core/services/role.service';
import { RoleDetailResponse } from '@application/dtos/responses/role.response';
import { IRoleRepository } from '@core/repositories/role.repository.interface';
import { Inject } from '@nestjs/common';
import { RoleMapper } from '@application/mappers/role.mapper';

export class RemovePermissionCommand {
  constructor(
    public readonly roleId: string,
    public readonly permissionId: string,
  ) {}
}

@CommandHandler(RemovePermissionCommand)
export class RemovePermissionCommandHandler
  implements ICommandHandler<RemovePermissionCommand, RoleDetailResponse>
{
  constructor(
    private readonly roleService: RoleService,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: RemovePermissionCommand): Promise<RoleDetailResponse> {
    const { roleId, permissionId } = command;

    // Remove the permission from the role
    const role = await this.roleService.removePermissionFromRole(roleId, permissionId);

    // Fetch the updated role with permissions
    const updatedRole = await this.roleRepository.findById(role.id);

    // Use the mapper to convert to response DTO
    return RoleMapper.toDetailResponse(updatedRole);
  }
}
