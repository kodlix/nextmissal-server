import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventRepository } from '../repositories/event.repository';
import { EventEntity } from '../entities/event.entity';

export class GetEventByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetEventByIdQuery)
export class GetEventByIdHandler implements IQueryHandler<GetEventByIdQuery> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(query: GetEventByIdQuery): Promise<EventEntity | null> {
    const event = await this.eventRepository.findById(query.id);

    return event ? new EventEntity(event) : null;
  }
}
