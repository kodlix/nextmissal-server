import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  UserRegisteredEvent,
  UserActivatedEvent,
  UserRoleAssignedEvent,
  UserTwoFactorEnabledEvent,
} from '@core/events/user.events';
import { LoggerService } from '@core/logger/logger.service';

/**
 * Application Event Service that registers domain event handlers
 * This demonstrates how to use the DomainEventService in practice
 */
@Injectable()
export class ApplicationEventService {
  constructor(private readonly logger: LoggerService) {}

  @OnEvent('UserRegisteredEvent')
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    this.logger.log({
      message: 'User registered',
      userId: event.userId.getValue(),
      email: event.email,
      eventId: event.eventId,
    });
    // Here you could add additional side effects like:
    // - Send welcome email
    // - Create user profile
    // - Initialize user preferences
  }

  @OnEvent('UserActivatedEvent')
  async handleUserActivatedEvent(event: UserActivatedEvent) {
    this.logger.log({
      message: 'User activated',
      userId: event.userId.getValue(),
      eventId: event.eventId,
    });
    // Here you could add additional side effects like:
    // - Send activation confirmation email
    // - Enable user features
    // - Update analytics
  }

  @OnEvent('UserRoleAssignedEvent')
  async handleUserRoleAssignedEvent(event: UserRoleAssignedEvent) {
    this.logger.log({
      message: 'Role assigned to user',
      userId: event.userId.getValue(),
      roleId: event.roleId.getValue(),
      roleName: event.roleName,
      eventId: event.eventId,
    });
    // Here you could add additional side effects like:
    // - Invalidate permission cache
    // - Send notification to admin
    // - Update user session
  }

  @OnEvent('UserTwoFactorEnabledEvent')
  async handleUserTwoFactorEnabledEvent(event: UserTwoFactorEnabledEvent) {
    this.logger.log({
      message: 'Two-factor authentication enabled',
      userId: event.userId.getValue(),
      eventId: event.eventId,
    });
    // Here you could add additional side effects like:
    // - Send security notification email
    // - Update security audit log
    // - Generate backup codes
  }
}
