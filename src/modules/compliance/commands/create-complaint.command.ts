import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CreateComplaintDto } from '../dto/create-complaint.dto';
import { ComplaintRepository } from '../repositories/complaint.repository';
import { ComplaintEntity } from '../entities/complaint.entity';

export class CreateComplaintCommand implements ICommand {
  constructor(
    public readonly createComplaintDto: CreateComplaintDto,
    public readonly reporterUserId: bigint,
  ) {}
}

@CommandHandler(CreateComplaintCommand)
export class CreateComplaintHandler implements ICommandHandler<CreateComplaintCommand> {
  constructor(private readonly complaintRepository: ComplaintRepository) {}

  async execute(command: CreateComplaintCommand): Promise<ComplaintEntity> {
    const { createComplaintDto, reporterUserId } = command;

    return this.complaintRepository.create(createComplaintDto, reporterUserId);
  }
}
