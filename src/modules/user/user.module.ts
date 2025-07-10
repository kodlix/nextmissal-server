import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_REPOSITORY, ROLE_REPOSITORY } from '@shared/constants/tokens';

// Controllers
import { UserController } from './user.controller';

// Repositories
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { RoleRepository } from 'src/modules/role/repositories/role.repository';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { CoreModule } from '@core/core.module';

// Services
import { UserService } from '@modules/user/services/user.service';

// Query Handlers
import { GetUserQueryHandler } from '@modules/user/queries/get-user.query';
import { GetUsersQueryHandler } from '@modules/user/queries/get-users.query';

// Command Handlers
import { UpdateUserCommandHandler } from 'src/modules/user/commands/update-user.command';
import { ChangePasswordCommandHandler } from 'src/modules/user/commands/change-password.command';
import { ActivateUserCommandHandler } from 'src/modules/user/commands/activate-user.command';
import { AssignRoleCommandHandler } from 'src/modules/user/commands/assign-role.command';
import { RemoveRoleCommandHandler } from 'src/modules/user/commands/remove-role.command';
import { VerifyPasswordCommandHandler } from 'src/modules/user/commands/verify-password.command';

const queryHandlers = [GetUserQueryHandler, GetUsersQueryHandler];

const commandHandlers = [
  UpdateUserCommandHandler,
  ChangePasswordCommandHandler,
  ActivateUserCommandHandler,
  AssignRoleCommandHandler,
  RemoveRoleCommandHandler,
  VerifyPasswordCommandHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule, CoreModule],
  controllers: [UserController],
  providers: [
    // Services
    {
      provide: UserService,
      useClass: UserService,
    },

    // Repository tokens
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },

    // Query handlers
    ...queryHandlers,

    // Command handlers
    ...commandHandlers,
  ],
  exports: [UserService],
})
export class UserModule {}
