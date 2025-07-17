import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProgrammeRepository } from '../repositories/programme.repository';
import { ProgrammeEntity } from '../entities/programme.entity';

export class GetProgrammeByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetProgrammeByIdQuery)
export class GetProgrammeByIdHandler implements IQueryHandler<GetProgrammeByIdQuery> {
  constructor(private readonly programmeRepository: ProgrammeRepository) {}

  async execute(query: GetProgrammeByIdQuery): Promise<ProgrammeEntity | null> {
    const programme = await this.programmeRepository.findById(query.id);

    return programme ? new ProgrammeEntity(programme) : null;
  }
}
