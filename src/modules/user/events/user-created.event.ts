import { DomainEvent } from '@core/events/domain-event.base';
import { UserId } from '@core/value-objects/user-id.vo';

export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'UserCreatedEvent';
  }
}
