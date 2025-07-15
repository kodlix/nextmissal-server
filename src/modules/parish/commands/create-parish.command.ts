import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateParishDto } from '@modules/parish/dtos/create-parish.dto';
import { ParishRepository } from '@modules/parish/repositories/parish.repository';
import { Parish } from '@modules/parish/entities/parish.entity';

export class CreateParishCommand implements ICommand {
  constructor(
    public readonly createParishDto: CreateParishDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateParishCommand)
export class CreateParishHandler implements ICommandHandler<CreateParishCommand> {
  constructor(private readonly parishRepository: ParishRepository) {}

  async execute(command: CreateParishCommand): Promise<Parish> {
    const {
      name,
      profile,
      email,
      telephone,
      slogan,
      address,
      town,
      lga,
      state,
      postOfficeAddress,
      website,
      logo,
      vision,
      mission,
      establishedOn,
      active,
      isStation,
      parentParishId,
      denaryId,
      parishPriest,
      assistantPriest1,
      assistantPriest2,
      parishPriestPhoneNumber,
      assistantPriest1PhoneNumber,
      assistantPriest2PhoneNumber,
    } = command.createParishDto;

    const parish = Parish.create({
      name,
      profile,
      email,
      telephone,
      slogan,
      address,
      town,
      lga,
      state,
      postOfficeAddress,
      website,
      logo,
      vision,
      mission,
      establishedOn,
      active,
      isStation,
      parentParishId,
      denaryId,
      parishPriest,
      assistantPriest1,
      assistantPriest2,
      parishPriestPhoneNumber,
      assistantPriest1PhoneNumber,
      assistantPriest2PhoneNumber,
      createdBy: command.userId,
    });

    return this.parishRepository.create(parish);
  }
}
