import { Module } from '@nestjs/common';
import { DomainEventService } from './services/domain-event.service';
import { DomainValidationService } from './services/domain-validation.service';
import { UserAuthorizationService } from '../modules/auth/services/user-authorization.service';
import { ApplicationEventService } from './services/application-event.service';
import { HealthService } from './services/health.service';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { EventsModule } from '@core/events/events.module';

/**
 * Core Domain Module
 * Contains all domain services and DDD infrastructure
 */
@Module({
  imports: [ConfigModule, PrismaModule, EventsModule],
  providers: [
    DomainEventService,
    DomainValidationService,
    UserAuthorizationService,
    ApplicationEventService,
    HealthService,
  ],
  exports: [
    DomainEventService,
    DomainValidationService,
    UserAuthorizationService,
    ApplicationEventService,
    HealthService,
  ],
})
export class CoreModule {}
