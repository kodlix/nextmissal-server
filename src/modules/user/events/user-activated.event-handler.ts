import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '@core/events/domain-event.base';
import { LoggerService } from '@core/logger/logger.service';

export class UserActivatedEvent extends DomainEvent {
  constructor(public readonly userId: bigint) {
    super();
  }

  getEventName(): string {
    return 'user.activated';
  }
}

@Injectable()
export class UserActivatedEventHandler {
  constructor(private readonly logger: LoggerService) {}

  @OnEvent('UserActivatedEvent')
  async handleUserActivatedEvent(event: UserActivatedEvent) {
    this.logger.log({
      message: 'User activated',
      userId: event.userId,
      eventId: event.eventId,
    });
    // Here you could add additional side effects like:
    // - Send activation confirmation email
    // - Enable user features
    // - Update analytics
  }
}
