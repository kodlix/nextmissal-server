import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@core/services/user.service';
import { UserBaseResponse } from '@application/dtos/responses/user.response';

export class ActivateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly active: boolean,
  ) {}
}

@CommandHandler(ActivateUserCommand)
export class ActivateUserCommandHandler implements ICommandHandler<ActivateUserCommand, UserBaseResponse> {
  constructor(
    private readonly userService: UserService,
  ) {}

  async execute(command: ActivateUserCommand): Promise<UserBaseResponse> {
    const { userId, active } = command;
    
    let user;
    if (active) {
      user = await this.userService.activateUser(userId);
    } else {
      user = await this.userService.deactivateUser(userId);
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}