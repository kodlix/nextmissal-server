import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DenaryRepository } from '../repositories/denary.repository';
import { Denary } from '../entities/denary.entity';

export class GetDenaryByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetDenaryByIdQuery)
export class GetDenaryByIdHandler implements IQueryHandler<GetDenaryByIdQuery> {
  constructor(private readonly denaryRepository: DenaryRepository) {}

  async execute(query: GetDenaryByIdQuery): Promise<Denary | null> {
    return this.denaryRepository.findById(query.id);
  }
}
