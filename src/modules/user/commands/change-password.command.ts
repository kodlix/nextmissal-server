import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@modules/user/services/user.service';

export class ChangePasswordCommand {
  constructor(
    public readonly userId: bigint,
    public readonly newPassword: string,
    public readonly currentPassword?: string,
  ) {}
}

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler implements ICommandHandler<ChangePasswordCommand, void> {
  constructor(private readonly userService: UserService) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const { userId, newPassword, currentPassword } = command;

    await this.userService.changePassword(userId, newPassword, currentPassword);
  }
}
