import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEventDto } from '../dtos/create-event.dto';
import { EventRepository } from '../repositories/event.repository';
import { EventEntity } from '../entities/event.entity';

export class CreateEventCommand {
  constructor(
    public readonly createEventDto: CreateEventDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(command: CreateEventCommand): Promise<EventEntity> {
    const { createEventDto, userId } = command;
    const event = await this.eventRepository.create({
      ...createEventDto,
      createdBy: userId,
      updatedBy: userId,
    });

    return new EventEntity(event);
  }
}
