import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DioceseSocietyRepository } from '../repositories/diocese-society.repository';
import { DioceseSocietyEntity } from '../entities/diocese-society.entity';
import { GetMappedSocietiesDto } from '../dtos/get-mapped-societies.dto';

export class GetMappedSocietiesQuery implements IQuery {
  constructor(
    public readonly dioceseId: number,
    public readonly getMappedSocietiesDto: GetMappedSocietiesDto,
  ) {}
}

@QueryHandler(GetMappedSocietiesQuery)
export class GetMappedSocietiesHandler implements IQueryHandler<GetMappedSocietiesQuery> {
  constructor(private readonly dioceseSocietyRepository: DioceseSocietyRepository) {}

  async execute(query: GetMappedSocietiesQuery): Promise<DioceseSocietyEntity[]> {
    const { dioceseId, getMappedSocietiesDto } = query;
    const { page = 1, limit = 10, search, sort, active } = getMappedSocietiesDto;

    const mappedSocieties = await this.dioceseSocietyRepository.findManyByDioceseId(
      dioceseId,
      Number(page),
      Number(limit),
      search,
      sort,
      active,
    );

    return mappedSocieties.map(dioceseSociety => new DioceseSocietyEntity(dioceseSociety));
  }
}
