import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MapSocietiesToDioceseDto } from '../dtos/map-societies-to-diocese.dto';
import { DioceseSocietyRepository } from '../repositories/diocese-society.repository';
import { DioceseSocietyEntity } from '../entities/diocese-society.entity';

export class MapSocietiesToDioceseCommand {
  constructor(
    public readonly mapSocietiesToDioceseDto: MapSocietiesToDioceseDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(MapSocietiesToDioceseCommand)
export class MapSocietiesToDioceseHandler implements ICommandHandler<MapSocietiesToDioceseCommand> {
  constructor(private readonly dioceseSocietyRepository: DioceseSocietyRepository) {}

  async execute(command: MapSocietiesToDioceseCommand): Promise<DioceseSocietyEntity[]> {
    const { mapSocietiesToDioceseDto, userId } = command;
    const mappedSocieties: DioceseSocietyEntity[] = [];

    for (const item of mapSocietiesToDioceseDto.societies) {
      const dioceseSociety = await this.dioceseSocietyRepository.upsert(
        mapSocietiesToDioceseDto.dioceseId,
        item.societyId,
        {
          diocese: { connect: { id: mapSocietiesToDioceseDto.dioceseId } },
          society: { connect: { id: item.societyId } },
          description: item.description || '',
          active: item.active !== undefined ? item.active : true,
          createdBy: userId,
          updatedBy: userId,
        },
      );
      mappedSocieties.push(new DioceseSocietyEntity(dioceseSociety));
    }

    return mappedSocieties;
  }
}
