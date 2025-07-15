import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DenaryRepository } from '../repositories/denary.repository';
import { Denary } from '../entities/denary.entity';
import { CreateDenaryDto } from '../dtos/create-denary.dto';

export class CreateDenaryCommand implements ICommand {
  constructor(
    public readonly createDenaryDto: CreateDenaryDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateDenaryCommand)
export class CreateDenaryHandler implements ICommandHandler<CreateDenaryCommand> {
  constructor(private readonly denaryRepository: DenaryRepository) {}

  async execute(command: CreateDenaryCommand): Promise<Denary> {
    const { name, dean, address, dioceseId, profile, active } = command.createDenaryDto;

    const denary = Denary.create({
      name,
      dean,
      address,
      dioceseId,
      profile,
      active,
      createdBy: command.userId,
    });

    return this.denaryRepository.create(denary);
  }
}
