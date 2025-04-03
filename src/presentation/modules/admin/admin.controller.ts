import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

// Guards & Decorators
import { RolesGuard } from '@presentation/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RolesEnum } from '@shared/constants/roles.constants';

@ApiTags('admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(RolesEnum.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor() {}

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get admin dashboard data (Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns dashboard statistics' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async getDashboard() {
    return {
      message: 'Admin dashboard data',
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        totalRoles: 0,
      },
    };
  }
}
