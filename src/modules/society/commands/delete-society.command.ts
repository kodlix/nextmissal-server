import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SocietyRepository } from '../repositories/society.repository';

export class DeleteSocietyCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteSocietyCommand)
export class DeleteSocietyHandler implements ICommandHandler<DeleteSocietyCommand> {
  constructor(private readonly societyRepository: SocietyRepository) {}

  async execute(command: DeleteSocietyCommand): Promise<void> {
    await this.societyRepository.delete(command.id);
  }
}
