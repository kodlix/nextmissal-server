import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ParishRepository } from '@modules/parish/repositories/parish.repository';

export class DeleteParishCommand implements ICommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteParishCommand)
export class DeleteParishHandler implements ICommandHandler<DeleteParishCommand> {
  constructor(private readonly parishRepository: ParishRepository) {}

  async execute(command: DeleteParishCommand): Promise<boolean> {
    const { id } = command;

    return this.parishRepository.delete(id);
  }
}
