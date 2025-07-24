import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterEventAttendeeDto } from '../dtos/register-event-attendee.dto';
import { EventAttendeeRepository } from '../repositories/event-attendee.repository';
import { EventAttendeeEntity } from '../entities/event-attendee.entity';
import { EventAttendee, Prisma } from '@prisma/client';

export class RegisterEventAttendeeCommand {
  constructor(
    public readonly registerEventAttendeeDto: RegisterEventAttendeeDto,
    public readonly userId: bigint,
  ) {}
}

@CommandHandler(RegisterEventAttendeeCommand)
export class RegisterEventAttendeeHandler implements ICommandHandler<RegisterEventAttendeeCommand> {
  constructor(private readonly eventAttendeeRepository: EventAttendeeRepository) {}

  async execute(command: RegisterEventAttendeeCommand): Promise<EventAttendeeEntity> {
    const { registerEventAttendeeDto, userId } = command;
    const { eventId, status } = registerEventAttendeeDto;

    const data: Prisma.EventAttendeeCreateInput = {
      user: { connect: { id: userId } },
      event: { connect: { id: eventId } },
      status: status || 'REGISTERED',
    };

    const existingAttendee = await this.eventAttendeeRepository.findOne(userId, eventId);

    let eventAttendee: EventAttendee;
    if (existingAttendee) {
      eventAttendee = await this.eventAttendeeRepository.update(userId, eventId, data);
    } else {
      eventAttendee = await this.eventAttendeeRepository.create(data);
    }

    return new EventAttendeeEntity(eventAttendee);
  }
}
