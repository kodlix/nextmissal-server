import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@modules/user/services/user.service';
import { IUserBaseResponse } from '@modules/user/user.response';
import { UserMapper } from '@modules/user/user.mapper';

export class UpdateUserCommand {
  constructor(
    public readonly userId: bigint,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly email?: string,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand, IUserBaseResponse>
{
  constructor(private readonly userService: UserService) {}

  async execute(command: UpdateUserCommand): Promise<IUserBaseResponse> {
    const { userId, firstName, lastName, email } = command;

    const user = await this.userService.updateUserDetails(userId, firstName, lastName, email);

    // Use the mapper to convert to response DTO
    return UserMapper.toBaseResponse(user);
  }
}
