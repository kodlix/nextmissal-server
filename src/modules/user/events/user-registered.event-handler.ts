import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '@core/events/domain-event.base';
import { LoggerService } from '@core/logger/logger.service';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: bigint,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'user.registered';
  }
}

@Injectable()
export class UserRegisteredEventHandler {
  constructor(private readonly logger: LoggerService) {}

  @OnEvent('UserRegisteredEvent')
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    this.logger.log({
      message: 'User registered',
      email: event.email,
      eventId: event.eventId,
    });
    // Here you could add additional side effects like:
    // - Send welcome email
    // - Create user profile
    // - Initialize user preferences
  }
}
