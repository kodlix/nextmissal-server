import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSocietyDto } from '../dtos/update-society.dto';
import { SocietyRepository } from '../repositories/society.repository';
import { SocietyEntity } from '../entities/society.entity';

export class UpdateSocietyCommand {
  constructor(
    public readonly id: number,
    public readonly updateSocietyDto: UpdateSocietyDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateSocietyCommand)
export class UpdateSocietyHandler implements ICommandHandler<UpdateSocietyCommand> {
  constructor(private readonly societyRepository: SocietyRepository) {}

  async execute(command: UpdateSocietyCommand): Promise<SocietyEntity> {
    const { id, updateSocietyDto, userId } = command;
    const society = await this.societyRepository.update(id, {
      ...updateSocietyDto,
      updatedBy: userId,
    });

    return new SocietyEntity(society);
  }
}
