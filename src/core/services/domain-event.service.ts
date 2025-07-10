import { Injectable } from '@nestjs/common';
import { DomainEvent, AggregateRoot } from '@core/events/domain-event.base';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Domain Event Service for managing and dispatching domain events
 * This is a core DDD pattern for handling side effects and maintaining loose coupling
 */
@Injectable()
export class DomainEventService {
  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Dispatch all domain events from an aggregate root
   */
  async dispatchEventsFromAggregate(aggregate: AggregateRoot): Promise<void> {
    const events = aggregate.getDomainEvents();

    // Clear events from aggregate to prevent double processing
    aggregate.clearDomainEvents();

    // Process events sequentially to maintain consistency
    for (const event of events) {
      await this.dispatchEvent(event);
    }
  }

  /**
   * Dispatch multiple aggregates' events in a transaction-like manner
   */
  async dispatchEventsFromAggregates(aggregates: AggregateRoot[]): Promise<void> {
    // Collect all events first
    const allEvents: DomainEvent[] = [];

    for (const aggregate of aggregates) {
      allEvents.push(...aggregate.getDomainEvents());
      aggregate.clearDomainEvents();
    }

    // Process all events
    for (const event of allEvents) {
      await this.dispatchEvent(event);
    }
  }

  /**
   * Dispatch a single domain event
   */
  async dispatchEvent(event: DomainEvent): Promise<void> {
    try {
      this.eventEmitter.emit(event.getEventName(), event);
    } catch (error) {
      // Log error but don't throw to prevent transaction rollback
      console.error(`Error handling domain event ${event.getEventName()}:`, error);
      // In a real application, you'd use proper logging and potentially
      // implement a dead letter queue or retry mechanism
    }
  }
}
