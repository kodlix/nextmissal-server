import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Controllers
import { UserController } from './user.controller';

// Repositories
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { RoleRepository } from '@infrastructure/repositories/role.repository';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';

// Services
import { UserService } from '@core/services/user.service';

// Query Handlers
import { GetUserQueryHandler } from '@application/queries/user/get-user.query';
import { GetUsersQueryHandler } from '@application/queries/user/get-users.query';

const queryHandlers = [
  GetUserQueryHandler,
  GetUsersQueryHandler,
];

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [
    // Services
    UserService,
    
    // Repository tokens
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'RoleRepository',
      useClass: RoleRepository,
    },
    
    // Query handlers
    ...queryHandlers,
  ],
  exports: [UserService],
})
export class UserModule {}