import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventRepository } from '../repositories/event.repository';

export class DeleteEventCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteEventCommand)
export class DeleteEventHandler implements ICommandHandler<DeleteEventCommand> {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(command: DeleteEventCommand): Promise<void> {
    await this.eventRepository.delete(command.id);
  }
}
