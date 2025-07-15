import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDenariesDto } from '../dtos/get-denaries.dto';
import { DenaryRepository } from '../repositories/denary.repository';
import { Denary } from '../entities/denary.entity';

export class GetDenariesQuery implements IQuery {
  constructor(public readonly getDenariesDto: GetDenariesDto) {}
}

@QueryHandler(GetDenariesQuery)
export class GetDenariesHandler implements IQueryHandler<GetDenariesQuery> {
  constructor(private readonly denaryRepository: DenaryRepository) {}

  async execute(query: GetDenariesQuery): Promise<Denary[]> {
    const { page = 1, limit = 10, search, sort, dioceseId } = query.getDenariesDto;

    return this.denaryRepository.findAll(Number(page), Number(limit), search, sort, dioceseId);
  }
}
