import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Controllers
import { RoleController } from './role.controller';

// Repositories
import { RoleRepository } from '@infrastructure/repositories/role.repository';
import { PermissionRepository } from '@infrastructure/repositories/permission.repository';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';

// Services
import { RoleService } from '@core/services/role.service';
import { PermissionService } from '@core/services/permission.service';

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
  ],
  controllers: [RoleController],
  providers: [
    // Services
    RoleService,
    PermissionService,
    
    // Repository tokens
    {
      provide: 'RoleRepository',
      useClass: RoleRepository,
    },
    {
      provide: 'PermissionRepository',
      useClass: PermissionRepository,
    },
  ],
})
export class RoleModule {}