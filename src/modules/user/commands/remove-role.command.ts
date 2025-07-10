import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@modules/user/services/user.service';
import { IUserDetailResponse } from '@modules/user/user.response';
import { UserMapper } from '@modules/user/user.mapper';

export class RemoveRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly roleId: string,
  ) {}
}

@CommandHandler(RemoveRoleCommand)
export class RemoveRoleCommandHandler
  implements ICommandHandler<RemoveRoleCommand, IUserDetailResponse>
{
  constructor(private readonly userService: UserService) {}

  async execute(command: RemoveRoleCommand): Promise<IUserDetailResponse> {
    const { userId, roleId } = command;

    const user = await this.userService.removeRoleFromUser(userId, roleId);

    // Use the mapper to convert to response DTO
    return UserMapper.toDetailResponse(user);
  }
}
