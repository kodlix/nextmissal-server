import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Constants
import {
  USER_REPOSITORY,
  ROLE_REPOSITORY,
  OTP_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  EMAIL_VERIFICATION_REPOSITORY,
  PASSWORD_RESET_REPOSITORY,
} from '@shared/constants/tokens';

// Controllers
import { AuthController } from './auth.controller';

// Repositories
import { UserRepository } from '@modules/user/repositories/user.repository';
import { RoleRepository } from '@modules/role/repositories/role.repository';
import { OtpRepository } from '@modules/auth/repositories/otp.repository';
import { RefreshTokenRepository } from '@modules/auth/repositories/refresh-token.repository';
import { EmailVerificationRepository } from '@modules/auth/repositories/email-verification.repository';
import { PasswordResetRepository } from '@modules/auth/repositories/password-reset.repository';
import { EmailProvider } from './providers/email.provider';
import { TokenProvider } from './providers/token.provider';

// Services
import { UserService } from '@modules/user/services/user.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { I18nModule } from '@core/i18n/i18n.module';
import { CoreModule } from '@core/core.module';

// Command Handlers
import { RegisterUserCommandHandler } from '@modules/auth/commands/register-user.command';
import { LoginCommandHandler } from '@modules/auth/commands/login.command';
import { VerifyOtpCommandHandler } from '@modules/auth/commands/verify-otp.command';
import { RefreshTokenCommandHandler } from '@modules/auth/commands/refresh-token.command';
import { LogoutCommandHandler } from '@modules/auth/commands/logout.command';
import { SendVerificationEmailCommandHandler } from '@modules/auth/commands/send-verification-email.command';
import { VerifyEmailCommandHandler } from '@modules/auth/commands/verify-email.command';
import { CheckEmailVerificationStatusCommandHandler } from '@modules/auth/commands/check-email-verification-status.command';
import { RequestPasswordResetCommandHandler } from '@modules/auth/commands/request-password-reset.command';
import { ResetPasswordCommandHandler } from '@modules/auth/commands/reset-password.command';

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserEventsListener } from './listeners/user-events.listener';

const commandHandlers = [
  RegisterUserCommandHandler,
  LoginCommandHandler,
  VerifyOtpCommandHandler,
  RefreshTokenCommandHandler,
  LogoutCommandHandler,
  SendVerificationEmailCommandHandler,
  VerifyEmailCommandHandler,
  CheckEmailVerificationStatusCommandHandler,
  RequestPasswordResetCommandHandler,
  ResetPasswordCommandHandler,
];

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    I18nModule,
    CoreModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRATION', '15m'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Services
    UserService,
    AuthService,

    // Repository tokens
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
    {
      provide: OTP_REPOSITORY,
      useClass: OtpRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepository,
    },
    {
      provide: EMAIL_VERIFICATION_REPOSITORY,
      useClass: EmailVerificationRepository,
    },
    {
      provide: PASSWORD_RESET_REPOSITORY,
      useClass: PasswordResetRepository,
    },

    // Providers
    EmailProvider,
    TokenProvider,

    // Strategy
    JwtStrategy,

    // Event Listeners
    UserEventsListener,

    // Command handlers
    ...commandHandlers,
  ],
  exports: [UserService, AuthService],
})
export class AuthModule {}
