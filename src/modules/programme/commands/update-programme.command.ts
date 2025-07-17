import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProgrammeDto } from '../dtos/update-programme.dto';
import { ProgrammeRepository } from '../repositories/programme.repository';
import { ProgrammeEntity } from '../entities/programme.entity';

export class UpdateProgrammeCommand {
  constructor(
    public readonly id: number,
    public readonly updateProgrammeDto: UpdateProgrammeDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateProgrammeCommand)
export class UpdateProgrammeHandler implements ICommandHandler<UpdateProgrammeCommand> {
  constructor(private readonly programmeRepository: ProgrammeRepository) {}

  async execute(command: UpdateProgrammeCommand): Promise<ProgrammeEntity> {
    const { id, updateProgrammeDto, userId } = command;
    const programme = await this.programmeRepository.update(id, {
      ...updateProgrammeDto,
      updatedBy: userId,
    });

    return new ProgrammeEntity(programme);
  }
}
