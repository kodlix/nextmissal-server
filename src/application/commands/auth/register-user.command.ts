import { ICommand } from '@nestjs/cqrs';
import { RegisterDto } from '@application/dtos/auth/register.dto';
import { UserBaseResponse } from '@application/dtos/responses/user.response';

export class RegisterUserCommand implements ICommand {
  constructor(public readonly registerDto: RegisterDto) {}
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { UserService } from '@core/services/user.service';

@Injectable()
@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userService: UserService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<UserBaseResponse> {
    const { email, password, firstName, lastName } = command.registerDto;
    
    const user = await this.userService.createUser(
      email,
      password,
      firstName,
      lastName,
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}