import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@core/services/user.service';
import { UserDetailResponse } from '@application/dtos/responses/user.response';
import { UserMapper } from '@application/mappers/user.mapper';

export class AssignRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly roleId: string,
  ) {}
}

@CommandHandler(AssignRoleCommand)
export class AssignRoleCommandHandler implements ICommandHandler<AssignRoleCommand, UserDetailResponse> {
  constructor(
    private readonly userService: UserService,
  ) {}

  async execute(command: AssignRoleCommand): Promise<UserDetailResponse> {
    const { userId, roleId } = command;
    
    const user = await this.userService.assignRoleToUser(userId, roleId);

    // Use the mapper to convert to response DTO
    return UserMapper.toDetailResponse(user);
  }
}