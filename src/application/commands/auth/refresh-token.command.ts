import { ICommand } from '@nestjs/cqrs';
import { RefreshTokenDto } from '@application/dtos/auth/refresh-token.dto';
import { AuthRefreshTokenResponse } from '@application/dtos/responses/user.response';

export class RefreshTokenCommand implements ICommand {
  constructor(public readonly refreshTokenDto: RefreshTokenDto) {}
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from '@core/repositories/user.repository.interface';
import { IRoleRepository } from '@core/repositories/role.repository.interface';
import { AuthService } from '@core/services/auth.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<AuthRefreshTokenResponse> {
    const { refreshToken } = command.refreshTokenDto;
    
    // Validate refresh token
    const token = await this.authService.validateRefreshToken(refreshToken);
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Get user
    const user = await this.userRepository.findById(token.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Revoke current refresh token
    await this.authService.revokeRefreshToken(refreshToken);

    // Collect all permissions from all user roles
    const userPermissions = new Set<string>();
    for (const role of user.roles) {
      const roleWithPermissions = await this.roleRepository.findById(role.id);
      if (roleWithPermissions && roleWithPermissions.permissions) {
        roleWithPermissions.permissions.forEach(permission => {
          userPermissions.add(permission.name);
        });
      }
    }

    // Generate new JWT tokens
    const payload = { 
      sub: user.id, 
      email: user.email,
      roles: user.roles.map(role => role.name),
      permissions: Array.from(userPermissions),
    };
    
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
    });
    
    const newRefreshToken = uuidv4();
    await this.authService.createRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}