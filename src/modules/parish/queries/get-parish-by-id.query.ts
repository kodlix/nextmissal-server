import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ParishRepository } from '@modules/parish/repositories/parish.repository';
import { Parish } from '@modules/parish/entities/parish.entity';

export class GetParishByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetParishByIdQuery)
export class GetParishByIdHandler implements IQueryHandler<GetParishByIdQuery> {
  constructor(private readonly parishRepository: ParishRepository) {}

  async execute(query: GetParishByIdQuery): Promise<Parish | null> {
    return this.parishRepository.findById(query.id);
  }
}
