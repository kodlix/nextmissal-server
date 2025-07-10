import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoleService } from 'src/modules/role/services/role.service';

export class DeleteRoleCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleCommandHandler implements ICommandHandler<DeleteRoleCommand, boolean> {
  constructor(private readonly roleService: RoleService) {}

  async execute(command: DeleteRoleCommand): Promise<boolean> {
    const { id } = command;

    return this.roleService.deleteRole(id);
  }
}
