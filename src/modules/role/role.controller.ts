import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

// Guards & Decorators
import { PermissionsGuard } from '@shared/guards/permissions.guard';
import { RequirePermissions } from '@shared/decorators/permissions.decorator';
import { CanWrite, CanDelete } from '@shared/decorators/resource-permissions.decorator';

// DTOs
import { CreateRoleDto } from '@modules/role/dtos/create-role.dto';
import { UpdateRoleDto } from '@modules/role/dtos/update-role.dto';

// Queries
import { GetRolesQuery } from '@modules/role/queries/get-roles.query';
import { GetRoleQuery } from '@modules/role/queries/get-role.query';

// Commands
import { CreateRoleCommand } from 'src/modules/role/commands/create-role.command';
import { UpdateRoleCommand } from 'src/modules/role/commands/update-role.command';
import { DeleteRoleCommand } from 'src/modules/role/commands/delete-role.command';
import { AssignPermissionCommand } from 'src/modules/role/commands/assign-permission.command';
import { RemovePermissionCommand } from 'src/modules/role/commands/remove-permission.command';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(PermissionsGuard)
@RequirePermissions('role:read')
@ApiBearerAuth('JWT-auth')
export class RoleController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles (Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns a list of all roles' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async getAllRoles() {
    return this.queryBus.execute(new GetRolesQuery());
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get role by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns role information' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async getRoleById(@Param('id') id: string) {
    return this.queryBus.execute(new GetRoleQuery(id));
  }

  @Post()
  @CanWrite('role')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new role (Requires role:write permission)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Role created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have required permission',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.commandBus.execute(
      new CreateRoleCommand(
        createRoleDto.name,
        createRoleDto.description,
        createRoleDto.isDefault,
        createRoleDto.permissionIds,
      ),
    );
  }

  @Put(':id')
  @CanWrite('role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update role by ID (Requires role:write permission)' })
  @ApiParam({ name: 'id', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have required permission',
  })
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.commandBus.execute(
      new UpdateRoleCommand(
        id,
        updateRoleDto.name,
        updateRoleDto.description,
        updateRoleDto.isDefault,
      ),
    );
  }

  @Delete(':id')
  @CanDelete('role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete role by ID (Requires role:delete permission)' })
  @ApiParam({ name: 'id', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have required permission',
  })
  async deleteRole(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteRoleCommand(id));

    return { message: 'Role deleted successfully' };
  }

  @Post(':roleId/permissions/:permissionId')
  @CanWrite('role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permission to role (Requires role:write permission)' })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'permissionId',
    description: 'Permission ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission assigned to role successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role or permission not found' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have required permission',
  })
  async assignPermissionToRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.commandBus.execute(new AssignPermissionCommand(roleId, permissionId));
  }

  @Delete(':roleId/permissions/:permissionId')
  @CanWrite('role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove permission from role (Requires role:write permission)' })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'permissionId',
    description: 'Permission ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission removed from role successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role or permission not found' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have required permission',
  })
  async removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.commandBus.execute(new RemovePermissionCommand(roleId, permissionId));
  }
}
