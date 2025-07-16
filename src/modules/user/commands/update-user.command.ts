import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@modules/user/services/user.service';
import { IUserBaseResponse } from '@modules/user/user.response';
import { UserMapper } from '@modules/user/user.mapper';

export class UpdateUserCommand {
  constructor(
    public readonly userId: bigint,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly gender?: string,
    public readonly phoneNumber?: string,
    public readonly profileImage?: string,
    public readonly dateOfBirth?: Date,
    public readonly parishId?: number,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand, IUserBaseResponse>
{
  constructor(private readonly userService: UserService) {}

  async execute(command: UpdateUserCommand): Promise<IUserBaseResponse> {
    const {
      userId,
      firstName,
      lastName,
      gender,
      phoneNumber,
      profileImage,
      dateOfBirth,
      parishId,
    } = command;

    const user = await this.userService.updateUserDetails(
      userId,
      firstName,
      lastName,
      gender,
      phoneNumber,
      profileImage,
      dateOfBirth,
      parishId,
    );

    // Use the mapper to convert to response DTO
    return UserMapper.toBaseResponse(user);
  }
}
