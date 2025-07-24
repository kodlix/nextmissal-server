import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Modules
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { ThrottlerModule } from '@core/throttler/throttler.module';
import { I18nModule } from '@core/i18n/i18n.module';
import { LoggerModule } from '@core/logger/logger.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { CountryModule } from '@modules/country/country.module';
import { DioceseModule } from '@modules/diocese/diocese.module';
import { ParishModule } from '@modules/parish/parish.module';
import { RoleModule } from '@modules/role/role.module';
import { AdminModule } from '@modules/admin/admin.module';
import { StorageModule } from '@modules/storage/storage.module';
import { HealthModule } from '@modules/health/health.module';
import { SocietyModule } from '@modules/society/society.module';

import { CoreModule } from '@core/core.module';

// Global providers
import { LoggingInterceptor } from '@shared/interceptors/logging.interceptor';
import { TransformInterceptor } from '@shared/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '@shared/filters/all-exceptions.filter';
import { DomainExceptionsFilter } from '@shared/filters/domain-exceptions.filter';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';

// Config
import configuration from '@core/config/configuration';
import { DenaryModule } from '@modules/denary/denary.module';
import { ProgrammeModule } from '@modules/programme/programme.module';
import { EventModule } from '@modules/event/event.module';
import { PostModule } from './modules/post/post.module';

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
    CountryModule,
    AdminModule,
    StorageModule,
    HealthModule,
    ParishModule,
    DioceseModule,
    DenaryModule,
    SocietyModule,
    ProgrammeModule,
    EventModule,
    PostModule,
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
