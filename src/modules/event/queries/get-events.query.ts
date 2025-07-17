import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventRepository } from '../repositories/event.repository';
import { EventEntity } from '../entities/event.entity';
import { GetEventsDto } from '../dtos/get-events.dto';

export class GetEventsQuery implements IQuery {
  constructor(public readonly getEventsDto: GetEventsDto) {}
}

@QueryHandler(GetEventsQuery)
export class GetEventsHandler implements IQueryHandler<GetEventsQuery> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(query: GetEventsQuery): Promise<EventEntity[]> {
    const {
      page = 1,
      limit = 10,
      search,
      sort,
      isPublic,
      startDate,
      endDate,
      parishId,
      denaryId,
      dioceseId,
      societyId,
    } = query.getEventsDto;

    const events = await this.eventRepository.findAll(
      Number(page),
      Number(limit),
      search,
      sort,
      isPublic,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      parishId,
      denaryId,
      dioceseId,
      societyId,
    );

    return events.map(event => new EventEntity(event));
  }
}
