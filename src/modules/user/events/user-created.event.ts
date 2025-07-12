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
