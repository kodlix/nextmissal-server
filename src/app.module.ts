import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Modules
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { ThrottlerModule } from '@core/throttler/throttler.module';
import { I18nModule } from '@core/i18n/i18n.module';
import { LoggerModule } from '@core/logger/logger.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { RoleModule } from 'src/modules/role/role.module';
import { AdminModule } from 'src/modules/admin/admin.module';
import { StorageModule } from 'src/modules/storage/storage.module';
import { HealthModule } from 'src/modules/health/health.module';
import { CoreModule } from '@core/core.module';

// Global providers
import { LoggingInterceptor } from '@shared/interceptors/logging.interceptor';
import { TransformInterceptor } from '@shared/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '@shared/filters/all-exceptions.filter';
import { DomainExceptionsFilter } from '@shared/filters/domain-exceptions.filter';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';

// Config
import configuration from '@core/config/configuration';

@Module({
  imports: [
    // Global Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),

    // Logging
    LoggerModule,

    // Database
    PrismaModule,

    // Rate Limiting
    ThrottlerModule,

    // Internationalization
    I18nModule,

    // CQRS
    CqrsModule,

    // Core Domain
    CoreModule,

    // Feature Modules
    AuthModule,
    UserModule,
    RoleModule,
    AdminModule,
    StorageModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    // Global filters
    {
      provide: APP_FILTER,
      useClass: DomainExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    // Global guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
