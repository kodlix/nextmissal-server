import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Controllers
import { AdminController } from './admin.controller';

// Import other modules
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    CqrsModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}