import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDiocesesDto } from '../dtos/get-dioceses.dto';
import { DioceseRepository } from '../repositories/diocese.repository';
import { Diocese } from '../entities/diocese.entity';

export class GetDiocesesQuery implements IQuery {
  constructor(public readonly getDiocesesDto: GetDiocesesDto) {}
}

@QueryHandler(GetDiocesesQuery)
export class GetDiocesesHandler implements IQueryHandler<GetDiocesesQuery> {
  constructor(private readonly dioceseRepository: DioceseRepository) {}

  async execute(query: GetDiocesesQuery): Promise<Diocese[]> {
    const { page = 1, limit = 10, search, sort } = query.getDiocesesDto;

    return this.dioceseRepository.findAll(Number(page), Number(limit), search, sort);
  }
}
