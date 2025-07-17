import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProgrammeRepository } from '../repositories/programme.repository';
import { ProgrammeEntity } from '../entities/programme.entity';
import { GetProgrammesDto } from '../dtos/get-programmes.dto';

export class GetProgrammesQuery implements IQuery {
  constructor(public readonly getProgrammesDto: GetProgrammesDto) {}
}

@QueryHandler(GetProgrammesQuery)
export class GetProgrammesHandler implements IQueryHandler<GetProgrammesQuery> {
  constructor(private readonly programmeRepository: ProgrammeRepository) {}

  async execute(query: GetProgrammesQuery): Promise<ProgrammeEntity[]> {
    const {
      page = 1,
      limit = 10,
      search,
      sort,
      active,
      programmeType,
      isGeneral,
      frequency,
      parishId,
      denaryId,
      dioceseId,
      societyId,
    } = query.getProgrammesDto;

    const programmes = await this.programmeRepository.findAll(
      Number(page),
      Number(limit),
      search,
      sort,
      active,
      programmeType,
      isGeneral,
      frequency,
      parishId,
      denaryId,
      dioceseId,
      societyId,
    );

    return programmes.map(programme => new ProgrammeEntity(programme));
  }
}
