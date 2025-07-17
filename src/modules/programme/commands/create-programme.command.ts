import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProgrammeDto } from '../dtos/create-programme.dto';
import { ProgrammeRepository } from '../repositories/programme.repository';
import { ProgrammeEntity } from '../entities/programme.entity';

export class CreateProgrammeCommand {
  constructor(
    public readonly createProgrammeDto: CreateProgrammeDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateProgrammeCommand)
export class CreateProgrammeHandler implements ICommandHandler<CreateProgrammeCommand> {
  constructor(private readonly programmeRepository: ProgrammeRepository) {}

  async execute(command: CreateProgrammeCommand): Promise<ProgrammeEntity> {
    const { createProgrammeDto, userId } = command;
    const programme = await this.programmeRepository.create({
      ...createProgrammeDto,
      createdBy: userId,
      updatedBy: userId,
    });

    return new ProgrammeEntity(programme);
  }
}
