import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@core/services/user.service';
import { UserDetailResponse } from '@application/dtos/responses/user.response';

export class RemoveRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly roleId: string,
  ) {}
}

@CommandHandler(RemoveRoleCommand)
export class RemoveRoleCommandHandler implements ICommandHandler<RemoveRoleCommand, UserDetailResponse> {
  constructor(
    private readonly userService: UserService,
  ) {}

  async execute(command: RemoveRoleCommand): Promise<UserDetailResponse> {
    const { userId, roleId } = command;
    
    const user = await this.userService.removeRoleFromUser(userId, roleId);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      otpEnabled: user.otpEnabled,
      lastLoginAt: user.lastLoginAt,
      roles: user.roles.map(role => ({
        id: role.id,
        name: role.name,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}