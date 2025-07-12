import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@modules/user/services/user.service';
import { IUserDetailResponse } from '@modules/user/user.response';
import { UserMapper } from '@modules/user/user.mapper';

export class AssignRoleCommand {
  constructor(
    public readonly userId: bigint,
    public readonly roleId: bigint,
  ) {}
}

@CommandHandler(AssignRoleCommand)
export class AssignRoleCommandHandler
  implements ICommandHandler<AssignRoleCommand, IUserDetailResponse>
{
  constructor(private readonly userService: UserService) {}

  async execute(command: AssignRoleCommand): Promise<IUserDetailResponse> {
    const { userId, roleId } = command;

    const user = await this.userService.assignRoleToUser(userId, roleId);

    // Use the mapper to convert to response DTO
    return UserMapper.toDetailResponse(user);
  }
}
