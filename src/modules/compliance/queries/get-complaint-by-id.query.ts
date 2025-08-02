import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ComplaintRepository } from '../repositories/complaint.repository';
import { ComplaintEntity } from '../entities/complaint.entity';

export class GetComplaintByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetComplaintByIdQuery)
export class GetComplaintByIdHandler implements IQueryHandler<GetComplaintByIdQuery> {
  constructor(private readonly complaintRepository: ComplaintRepository) {}

  async execute(query: GetComplaintByIdQuery): Promise<ComplaintEntity> {
    const { id } = query;

    return this.complaintRepository.findById(id);
  }
}
