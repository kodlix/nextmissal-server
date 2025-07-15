import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DenaryRepository } from '../repositories/denary.repository';

export class DeleteDenaryCommand implements ICommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteDenaryCommand)
export class DeleteDenaryHandler implements ICommandHandler<DeleteDenaryCommand> {
  constructor(private readonly denaryRepository: DenaryRepository) {}

  async execute(command: DeleteDenaryCommand): Promise<boolean> {
    const { id } = command;

    return this.denaryRepository.delete(id);
  }
}
