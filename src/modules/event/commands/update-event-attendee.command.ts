import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEventAttendeeDto } from '../dtos/update-event-attendee.dto';
import { EventAttendeeRepository } from '../repositories/event-attendee.repository';
import { EventAttendeeEntity } from '../entities/event-attendee.entity';

export class UpdateEventAttendeeCommand {
  constructor(
    public readonly eventId: number,
    public readonly userId: bigint,
    public readonly updateEventAttendeeDto: UpdateEventAttendeeDto,
  ) {}
}

@CommandHandler(UpdateEventAttendeeCommand)
export class UpdateEventAttendeeHandler implements ICommandHandler<UpdateEventAttendeeCommand> {
  constructor(private readonly eventAttendeeRepository: EventAttendeeRepository) {}

  async execute(command: UpdateEventAttendeeCommand): Promise<EventAttendeeEntity> {
    const { eventId, userId, updateEventAttendeeDto } = command;
    const eventAttendee = await this.eventAttendeeRepository.update(
      userId,
      eventId,
      updateEventAttendeeDto,
    );

    return new EventAttendeeEntity(eventAttendee);
  }
}
