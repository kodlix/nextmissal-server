import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDioceseDto } from '../dtos/create-diocese.dto';
import { DioceseRepository } from '../repositories/diocese.repository';
import { Diocese } from '../entities/diocese.entity';

export class CreateDioceseCommand implements ICommand {
  constructor(
    public readonly createDioceseDto: CreateDioceseDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateDioceseCommand)
export class CreateDioceseHandler implements ICommandHandler<CreateDioceseCommand> {
  constructor(private readonly dioceseRepository: DioceseRepository) {}

  async execute(command: CreateDioceseCommand): Promise<Diocese> {
    const {
      name,
      profile,
      cathedral,
      address,
      telephones,
      emails,
      province,
      bishop,
      isArchidiocese,
      countryId,
      active,
    } = command.createDioceseDto;

    const diocese = Diocese.create({
      name,
      profile,
      cathedral,
      address,
      telephones,
      emails,
      province,
      bishop,
      isArchidiocese,
      countryId,
      active,
      createdBy: command.userId,
    });

    return this.dioceseRepository.create(diocese);
  }
}
