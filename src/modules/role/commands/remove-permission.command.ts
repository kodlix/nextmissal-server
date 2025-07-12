import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoleService } from '@modules/role/services/role.service';
import { RoleDetailResponse } from '@modules/role/role.response';
import { IRoleRepository } from '@modules/role/repositories/role.repository.interface';
import { Inject } from '@nestjs/common';
import { RoleMapper } from '@modules/role/role.mapper';
import { ROLE_REPOSITORY } from '@shared/constants/tokens';

export class RemovePermissionCommand {
  constructor(
    public readonly roleId: bigint,
    public readonly permissionId: bigint,
  ) {}
}

@CommandHandler(RemovePermissionCommand)
export class RemovePermissionCommandHandler
  implements ICommandHandler<RemovePermissionCommand, RoleDetailResponse>
{
  constructor(
    private readonly roleService: RoleService,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: RemovePermissionCommand): Promise<RoleDetailResponse> {
    const { roleId, permissionId } = command;

    // Remove the permission from the role
    const role = await this.roleService.removePermissionFromRole(roleId, permissionId);

    // Fetch the updated role with permissions
    const updatedRole = await this.roleRepository.findById(role.id);

    if (!updatedRole) {
      throw new Error('Role not found after update');
    }

    // Use the mapper to convert to response DTO
    return RoleMapper.toDetailResponse(updatedRole);
  }
}
