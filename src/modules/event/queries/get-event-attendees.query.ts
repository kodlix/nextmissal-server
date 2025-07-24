import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventAttendeeRepository } from '../repositories/event-attendee.repository';
import { EventAttendeeEntity } from '../entities/event-attendee.entity';
import { GetEventAttendeesDto } from '../dtos/get-event-attendees.dto';

export class GetEventAttendeesQuery implements IQuery {
  constructor(
    public readonly eventId: number,
    public readonly getEventAttendeesDto: GetEventAttendeesDto,
  ) {}
}

@QueryHandler(GetEventAttendeesQuery)
export class GetEventAttendeesHandler implements IQueryHandler<GetEventAttendeesQuery> {
  constructor(private readonly eventAttendeeRepository: EventAttendeeRepository) {}

  async execute(query: GetEventAttendeesQuery): Promise<EventAttendeeEntity[]> {
    const { eventId, getEventAttendeesDto } = query;
    const { page = 1, limit = 10, search, sort, status, userId } = getEventAttendeesDto;

    const attendees = await this.eventAttendeeRepository.findAll(
      Number(page),
      Number(limit),
      eventId,
      search,
      sort,
      status,
      userId ? BigInt(userId) : undefined,
    );

    return attendees.map(attendee => new EventAttendeeEntity(attendee));
  }
}
