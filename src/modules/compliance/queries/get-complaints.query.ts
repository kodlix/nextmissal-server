import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ComplaintRepository } from '../repositories/complaint.repository';
import { ComplaintEntity } from '../entities/complaint.entity';

export class GetComplaintsQuery implements IQuery {}

@QueryHandler(GetComplaintsQuery)
export class GetComplaintsHandler implements IQueryHandler<GetComplaintsQuery> {
  constructor(private readonly complaintRepository: ComplaintRepository) {}

  async execute(): Promise<ComplaintEntity[]> {
    return this.complaintRepository.findAll();
  }
}
