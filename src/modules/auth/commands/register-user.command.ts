import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import { IUserBaseResponse } from 'src/modules/user/user.response';
import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user/services/user.service';
import { UserMapper } from '@modules/user/user.mapper';

export class RegisterUserCommand implements ICommand {
  constructor(public readonly registerDto: RegisterDto) {}
}

@Injectable()
@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(private readonly userService: UserService) {}

  async execute(command: RegisterUserCommand): Promise<IUserBaseResponse> {
    const { email, password, firstName, lastName } = command.registerDto;

    const user = await this.userService.createUser(email, password, firstName, lastName);

    // Use the mapper to convert to response DTO
    return UserMapper.toBaseResponse(user);
  }
}
