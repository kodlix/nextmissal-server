import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetParishesDto } from '@modules/parish/dtos/get-parishes.dto';
import { ParishRepository } from '@modules/parish/repositories/parish.repository';
import { Parish } from '@modules/parish/entities/parish.entity';

export class GetParishesQuery implements IQuery {
  constructor(public readonly getParishesDto: GetParishesDto) {}
}

@QueryHandler(GetParishesQuery)
export class GetParishesHandler implements IQueryHandler<GetParishesQuery> {
  constructor(private readonly parishRepository: ParishRepository) {}

  async execute(query: GetParishesQuery): Promise<Parish[]> {
    const { page = 1, limit = 10, search, sort } = query.getParishesDto;

    return this.parishRepository.findAll(Number(page), Number(limit), search, sort);
  }
}
