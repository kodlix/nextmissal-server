import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { SocietyRepository } from '../repositories/society.repository';
import { SocietyEntity } from '../entities/society.entity';
import { GetSocietiesDto } from '../dtos/get-societies.dto';

export class GetAllSocietiesQuery {
  constructor(public readonly getSocietiesDto: GetSocietiesDto) {}
}

@QueryHandler(GetAllSocietiesQuery)
export class GetAllSocietiesHandler implements IQueryHandler<GetAllSocietiesQuery> {
  constructor(private readonly societyRepository: SocietyRepository) {}

  async execute(query: GetAllSocietiesQuery): Promise<SocietyEntity[]> {
    const { page = 1, limit = 10, search, sort } = query.getSocietiesDto;

    const societies = await this.societyRepository.findAll(
      Number(page),
      Number(limit),
      search,
      sort,
    );

    return societies.map(society => new SocietyEntity(society));
  }
}
