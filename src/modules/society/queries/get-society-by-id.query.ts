import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { SocietyRepository } from '../repositories/society.repository';
import { SocietyEntity } from '../entities/society.entity';

export class GetSocietyByIdQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetSocietyByIdQuery)
export class GetSocietyByIdHandler implements IQueryHandler<GetSocietyByIdQuery> {
  constructor(private readonly societyRepository: SocietyRepository) {}

  async execute(query: GetSocietyByIdQuery): Promise<SocietyEntity | null> {
    const society = await this.societyRepository.findById(query.id);

    return society ? new SocietyEntity(society) : null;
  }
}
