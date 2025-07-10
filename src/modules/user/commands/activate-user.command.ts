import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@modules/user/services/user.service';
import { IUserBaseResponse } from 'src/modules/user/user.response';

export class ActivateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly active: boolean,
  ) {}
}

@CommandHandler(ActivateUserCommand)
export class ActivateUserCommandHandler
  implements ICommandHandler<ActivateUserCommand, IUserBaseResponse>
{
  constructor(private readonly userService: UserService) {}

  async execute(command: ActivateUserCommand): Promise<IUserBaseResponse> {
    const { userId, active } = command;

    let user;
    if (active) {
      user = await this.userService.activateUser(userId);
    } else {
      user = await this.userService.deactivateUser(userId);
    }

    return {
      id: user.id,
      email: user.email.getValue(),
      firstName: user.firstName.getValue(),
      lastName: user.lastName.getValue(),
    };
  }
}
