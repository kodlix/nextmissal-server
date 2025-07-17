import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSocietyDto } from '../dtos/create-society.dto';
import { SocietyRepository } from '../repositories/society.repository';
import { SocietyEntity } from '../entities/society.entity';

export class CreateSocietyCommand {
  constructor(
    public readonly createSocietyDto: CreateSocietyDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateSocietyCommand)
export class CreateSocietyHandler implements ICommandHandler<CreateSocietyCommand> {
  constructor(private readonly societyRepository: SocietyRepository) {}

  async execute(command: CreateSocietyCommand): Promise<SocietyEntity> {
    const { createSocietyDto, userId } = command;
    const society = await this.societyRepository.create({
      ...createSocietyDto,
      createdBy: userId,
      updatedBy: userId,
    });

    return new SocietyEntity(society);
  }
}
