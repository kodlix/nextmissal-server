import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DioceseRepository } from '../repositories/diocese.repository';

export class DeleteDioceseCommand implements ICommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteDioceseCommand)
export class DeleteDioceseHandler implements ICommandHandler<DeleteDioceseCommand> {
  constructor(private readonly dioceseRepository: DioceseRepository) {}

  async execute(command: DeleteDioceseCommand): Promise<boolean> {
    const { id } = command;

    return this.dioceseRepository.delete(id);
  }
}
