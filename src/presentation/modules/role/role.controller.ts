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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

// Guards & Decorators
import { RolesGuard } from '@presentation/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RolesEnum } from '@shared/constants/roles.constants';

// DTOs
import { CreateRoleDto } from '@application/dtos/role/create-role.dto';
import { UpdateRoleDto } from '@application/dtos/role/update-role.dto';

// Services
import { RoleService } from '@core/services/role.service';

@ApiTags('roles')
@Controller('roles')
@UseGuards(RolesGuard)
@Roles(RolesEnum.ADMIN)
@ApiBearerAuth('JWT-auth')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles (Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns a list of all roles' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async getAllRoles() {
    // This would normally use a query
    return [];
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get role by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns role information' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async getRoleById(@Param('id') id: string) {
    // This would normally use a query
    return { id };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new role (Admin only)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Role created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    // This would normally use a command
    return { message: 'Role created successfully' };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update role by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    // This would normally use a command
    return { message: 'Role updated successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete role by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async deleteRole(@Param('id') id: string) {
    // This would normally use a command
    return { message: 'Role deleted successfully' };
  }

  @Post(':roleId/permissions/:permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permission to role (Admin only)' })
  @ApiParam({ name: 'roleId', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission assigned to role successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role or permission not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async assignPermissionToRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    // This would normally use a command
    return { message: 'Permission assigned to role successfully' };
  }

  @Delete(':roleId/permissions/:permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove permission from role (Admin only)' })
  @ApiParam({ name: 'roleId', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission removed from role successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role or permission not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    // This would normally use a command
    return { message: 'Permission removed from role successfully' };
  }
}