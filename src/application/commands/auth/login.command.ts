import { ICommand } from '@nestjs/cqrs';
import { LoginDto } from '@application/dtos/auth/login.dto';
import { AuthResponse } from '@application/dtos/responses/user.response';

export class LoginCommand implements ICommand {
  constructor(public readonly loginDto: LoginDto) {}
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';
import { IRoleRepository } from '@core/repositories/role.repository.interface';
import { TokenProvider } from '@presentation/modules/auth/providers/token.provider';

@Injectable()
@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly tokenProvider: TokenProvider,
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

    // Check if email is verified
    const isEmailVerified = await this.authService.isEmailVerified(email);
    
    // If email verification is required and not verified, prompt user to verify first
    if (!isEmailVerified) {
      return {
        requiresEmailVerification: true,
        userId: user.id,
        email: user.email,
        message: 'Email verification required',
      };
    }

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
    const { accessToken, refreshToken } = await this.tokenProvider.generateTokens(
      user, 
      Array.from(userPermissions),
      true // Email is verified at this point
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: true, // We know it's verified at this point
        roles: user.roles.map(role => ({
          id: role.id,
          name: role.name,
        })),
      },
    };
  }
}