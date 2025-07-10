import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestPasswordResetDto } from '@modules/auth/dtos/password-reset.dto';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@modules/auth/services/auth.service';
import { EmailProvider } from '@modules/auth/providers/email.provider';
import { EntityNotFoundException } from '@core/exceptions/domain-exceptions';

export class RequestPasswordResetCommand implements ICommand {
  constructor(public readonly dto: RequestPasswordResetDto) {}
}

@Injectable()
@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetCommandHandler
  implements ICommandHandler<RequestPasswordResetCommand, { message: string }>
{
  constructor(
    private readonly authService: AuthService,
    private readonly emailProvider: EmailProvider,
  ) {}

  async execute(command: RequestPasswordResetCommand): Promise<{ message: string }> {
    const { email } = command.dto;

    try {
      // Generate a reset token
      const token = await this.authService.createPasswordResetToken(email);

      // Send the password reset email
      await this.emailProvider.sendPasswordResetEmail(email, token);

      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        // For security reasons, we don't want to reveal whether an email exists in our system
        return {
          message:
            'If your email exists in our system, you will receive a password reset link shortly',
        };
      }
      throw error;
    }
  }
}
