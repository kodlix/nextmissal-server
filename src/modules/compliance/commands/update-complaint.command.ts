import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UpdateComplaintDto } from '../dto/update-complaint.dto';
import { ComplaintRepository } from '../repositories/complaint.repository';
import { ComplaintEntity } from '../entities/complaint.entity';

export class UpdateComplaintCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly updateComplaintDto: UpdateComplaintDto,
  ) {}
}

@CommandHandler(UpdateComplaintCommand)
export class UpdateComplaintHandler implements ICommandHandler<UpdateComplaintCommand> {
  constructor(private readonly complaintRepository: ComplaintRepository) {}

  async execute(command: UpdateComplaintCommand): Promise<ComplaintEntity> {
    const { id, updateComplaintDto } = command;

    return this.complaintRepository.update(id, updateComplaintDto);
  }
}
