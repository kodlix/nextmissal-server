import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ROLE_REPOSITORY, PERMISSION_REPOSITORY } from '@shared/constants/tokens';

// Controllers
import { RoleController } from './role.controller';

// Repositories
import { RoleRepository } from 'src/modules/role/repositories/role.repository';
import { PermissionRepository } from 'src/modules/role/repositories/permission.repository';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { CoreModule } from '@core/core.module';

// Services
import { RoleService } from 'src/modules/role/services/role.service';
import { PermissionService } from 'src/modules/role/services/permission.service';

// Query Handlers
import { GetRolesQueryHandler } from '@modules/role/queries/get-roles.query';
import { GetRoleQueryHandler } from '@modules/role/queries/get-role.query';

// Command Handlers
import { CreateRoleCommandHandler } from 'src/modules/role/commands/create-role.command';
import { UpdateRoleCommandHandler } from 'src/modules/role/commands/update-role.command';
import { DeleteRoleCommandHandler } from 'src/modules/role/commands/delete-role.command';
import { AssignPermissionCommandHandler } from 'src/modules/role/commands/assign-permission.command';
import { RemovePermissionCommandHandler } from 'src/modules/role/commands/remove-permission.command';

const queryHandlers = [GetRolesQueryHandler, GetRoleQueryHandler];

const commandHandlers = [
  CreateRoleCommandHandler,
  UpdateRoleCommandHandler,
  DeleteRoleCommandHandler,
  AssignPermissionCommandHandler,
  RemovePermissionCommandHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule, CoreModule],
  controllers: [RoleController],
  providers: [
    // Services
    RoleService,
    PermissionService,

    // Repository tokens
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PermissionRepository,
    },

    // Query handlers
    ...queryHandlers,

    // Command handlers
    ...commandHandlers,
  ],
})
export class RoleModule {}
