import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@modules/auth/services/auth.service';

export class CheckEmailVerificationStatusCommand implements ICommand {
  constructor(public readonly email: string) {}
}

@Injectable()
@CommandHandler(CheckEmailVerificationStatusCommand)
export class CheckEmailVerificationStatusCommandHandler
  implements ICommandHandler<CheckEmailVerificationStatusCommand, boolean>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: CheckEmailVerificationStatusCommand): Promise<boolean> {
    const { email } = command;

    // Check if the email is verified
    return this.authService.isEmailVerified(email);
  }
}
