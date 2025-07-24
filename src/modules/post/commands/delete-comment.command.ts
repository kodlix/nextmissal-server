import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repositories/comment.repository';

export class DeleteCommentCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const { id } = command;
    await this.commentRepository.delete(id);
  }
}
