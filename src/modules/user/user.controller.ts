import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

// Guards & Decorators
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RolesEnum } from '@shared/constants/roles.constants';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

// DTOs
import { CreateUserDto } from '@modules/user/dtos/create-user.dto';
import { UpdateUserDto } from '@modules/user/dtos/update-user.dto';
import { ChangePasswordDto } from '@modules/user/dtos/change-password.dto';
import { ActivateUserDto } from '@modules/user/dtos/activate-user.dto';
import { AssignRoleDto } from '@modules/user/dtos/assign-role.dto';
import { PaginationDto } from '@shared/dtos/pagination.dto';

// Queries
import { GetUserQuery } from '@modules/user/queries/get-user.query';
import { GetUsersQuery } from '@modules/user/queries/get-users.query';

// Commands
import { UpdateUserCommand } from '@modules/user/commands/update-user.command';
import { ChangePasswordCommand } from '@modules/user/commands/change-password.command';
import { ActivateUserCommand } from '@modules/user/commands/activate-user.command';
import { AssignRoleCommand } from '@modules/user/commands/assign-role.command';
import { RemoveRoleCommand } from '@modules/user/commands/remove-role.command';
import { VerifyPasswordCommand } from '@modules/user/commands/verify-password.command';
import { IJwtPayload, IUserDetailResponse } from '@modules/user/user.response';
import { Paginated } from '@shared/dtos/paginated.dto';
import { UploadFileCommand } from '@modules/storage/commands/upload-file.command';
import { FileResponseDto } from '@modules/storage/file.response';

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for first name, last name, or email',
    example: 'John Doe',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order (e.g., firstName:asc,lastName:desc)',
    example: 'firstName:asc',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of all users',
    type: () => Paginated<IUserDetailResponse>,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async getAllUsers(@Query() pagination: PaginationDto) {
    return this.queryBus.execute(
      new GetUsersQuery(pagination.page, pagination.limit, pagination.search, pagination.sort),
    );
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns user information' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async getUserById(@Param('id') id: bigint) {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @Post()
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async createUser(@Body() _createUserDto: CreateUserDto) {
    // This would normally use a command
    return { message: 'User created successfully' };
  }

  @Put(':id')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async updateUser(@Param('id') id: bigint, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(
      new UpdateUserCommand(
        id,
        updateUserDto.firstName,
        updateUserDto.lastName,
        updateUserDto.gender,
        updateUserDto.phoneNumber,
        updateUserDto.profileImage,
        updateUserDto.dateOfBirth,
        updateUserDto.parishId,
      ),
    );
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async deleteUser(@Param('id') _id: bigint) {
    // This would normally use a command
    return { message: 'User deleted successfully' };
  }

  @Post(':id/change-password')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password changed successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async changePassword(@Param('id') id: bigint, @Body() changePasswordDto: ChangePasswordDto) {
    await this.commandBus.execute(
      new ChangePasswordCommand(
        id,
        changePasswordDto.newPassword,
        changePasswordDto.currentPassword,
      ),
    );

    return { message: 'Password changed successfully' };
  }

  @Post('/profile/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password changed successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Current password is incorrect' })
  async changeCurrentUserPassword(
    @CurrentUser() user: IJwtPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.commandBus.execute(
      new ChangePasswordCommand(
        user.sub,
        changePasswordDto.newPassword,
        changePasswordDto.currentPassword,
      ),
    );

    return { message: 'Password changed successfully' };
  }

  @Post('/profile/verify-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify current user password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password verification result' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async verifyCurrentUserPassword(
    @CurrentUser() user: IJwtPayload,
    @Body('password') password: string,
  ) {
    const isValid = await this.commandBus.execute(new VerifyPasswordCommand(user.sub, password));

    return { valid: isValid };
  }

  @Post('/profile/picture')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload user profile picture' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile picture uploaded successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid file or upload error' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @CurrentUser() user: IJwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    const uploadedFile = await this.commandBus.execute(
      new UploadFileCommand(
        {
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        },
        user.sub,
      ),
    );

    // Update user's profileImage field with the uploaded file's path
    await this.commandBus.execute(
      new UpdateUserCommand(
        user.sub,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        uploadedFile.path,
      ),
    );

    return uploadedFile;
  }

  @Patch(':id/activate')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate or deactivate user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User activation status updated' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async activateUser(@Param('id') id: bigint, @Body() activateUserDto: ActivateUserDto) {
    return this.commandBus.execute(new ActivateUserCommand(id, activateUserDto.active));
  }

  @Post(':id/roles')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign role to user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role assigned successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User or role not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async assignRoleToUser(@Param('id') id: bigint, @Body() assignRoleDto: AssignRoleDto) {
    return this.commandBus.execute(new AssignRoleCommand(id, assignRoleDto.roleId));
  }

  @Delete(':id/roles/:roleId')
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove role from user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role removed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async removeRoleFromUser(@Param('id') id: bigint, @Param('roleId') roleId: bigint) {
    return this.commandBus.execute(new RemoveRoleCommand(id, roleId));
  }
}
