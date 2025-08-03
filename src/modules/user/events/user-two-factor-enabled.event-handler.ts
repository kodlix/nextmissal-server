import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '@core/events/domain-event.base';
import { LoggerService } from '@core/logger/logger.service';

export class UserTwoFactorEnabledEvent extends DomainEvent {
  constructor(public readonly userId: bigint) {
    super();
  }

  getEventName(): string {
    return 'user.two_factor.enabled';
  }
}

@Injectable()
export class UserTwoFactorEnabledEventHandler {
  constructor(private readonly logger: LoggerService) {}

  @OnEvent('UserTwoFactorEnabledEvent')
  async handleUserTwoFactorEnabledEvent(event: UserTwoFactorEnabledEvent) {
    this.logger.log({
      message: 'Two-factor authentication enabled',
      userId: event.userId,
      eventId: event.eventId,
    });
    // Here you could add additional side effects like:
    // - Send security notification email
    // - Update security audit log
    // - Generate backup codes
  }
}
