import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { EventRepository } from '../repositories/event.repository';
import { EventEntity } from '../entities/event.entity';

export class UpdateEventCommand {
  constructor(
    public readonly id: number,
    public readonly updateEventDto: UpdateEventDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler implements ICommandHandler<UpdateEventCommand> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(command: UpdateEventCommand): Promise<EventEntity> {
    const { id, updateEventDto, userId } = command;
    const event = await this.eventRepository.update(id, {
      ...updateEventDto,
      updatedBy: userId,
    });

    return new EventEntity(event);
  }
}
