import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '@modules/user/events/user-created.event';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class UserEventsListener {
  constructor(private readonly logger: LoggerService) {}

  @OnEvent('UserCreatedEvent')
  handleUserCreatedEvent(event: UserCreatedEvent) {
    this.logger.log(`User created: ${event.userId.getValue()} with email ${event.email}`);
    // Here you can add logic to send a welcome email, provision resources, etc.
  }
}
