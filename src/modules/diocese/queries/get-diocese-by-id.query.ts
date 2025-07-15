import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DioceseRepository } from '../repositories/diocese.repository';
import { Diocese } from '../entities/diocese.entity';

export class GetDioceseByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetDioceseByIdQuery)
export class GetDioceseByIdHandler implements IQueryHandler<GetDioceseByIdQuery> {
  constructor(private readonly dioceseRepository: DioceseRepository) {}

  async execute(query: GetDioceseByIdQuery): Promise<Diocese | null> {
    return this.dioceseRepository.findById(query.id);
  }
}
