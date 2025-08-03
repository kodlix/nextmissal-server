import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerService } from '@core/logger/logger.service';
import { DomainEvent } from '@core/events/domain-event.base';

export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: bigint,
    public readonly email: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'UserCreatedEvent';
  }
}

@Injectable()
export class UserCreatedEventHandler {
  constructor(private readonly logger: LoggerService) {}

  @OnEvent('UserCreatedEvent')
  handleUserCreatedEvent(event: UserCreatedEvent) {
    this.logger.log(`User created: ${event.userId} with email ${event.email}`);
    // Here you can add logic to send a welcome email, provision resources, etc.
  }
}
