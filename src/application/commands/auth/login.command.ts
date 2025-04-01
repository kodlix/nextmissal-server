import { ICommand } from '@nestjs/cqrs';
import { LoginDto } from '@application/dtos/auth/login.dto';
import { AuthResponse } from '@application/dtos/responses/user.response';

export class LoginCommand implements ICommand {
  constructor(public readonly loginDto: LoginDto) {}
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';
import { IRoleRepository } from '@core/repositories/role.repository.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: LoginCommand): Promise<AuthResponse> {
    const { email, password } = command.loginDto;
    
    // Validate credentials
    const user = await this.userService.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.authService.updateLastLogin(user.id);

    // Check if OTP is enabled
    if (user.otpEnabled) {
      return {
        requiresOtp: true,
        userId: user.id,
        message: 'OTP verification required',
      };
    }

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

    // Generate JWT tokens
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
    
    const refreshToken = uuidv4();
    await this.authService.createRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles.map(role => ({
          id: role.id,
          name: role.name,
        })),
      },
    };
  }
}