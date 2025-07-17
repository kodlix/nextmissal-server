import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProgrammeRepository } from '../repositories/programme.repository';

export class DeleteProgrammeCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteProgrammeCommand)
export class DeleteProgrammeHandler implements ICommandHandler<DeleteProgrammeCommand> {
  constructor(private readonly programmeRepository: ProgrammeRepository) {}

  async execute(command: DeleteProgrammeCommand): Promise<void> {
    await this.programmeRepository.delete(command.id);
  }
}
