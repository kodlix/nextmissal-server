import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repositories/comment.repository';

export class UnlikeCommentCommand implements ICommand {
  constructor(
    public readonly commentId: number,
    public readonly userId: bigint,
  ) {}
}

@CommandHandler(UnlikeCommentCommand)
export class UnlikeCommentHandler implements ICommandHandler<UnlikeCommentCommand> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: UnlikeCommentCommand): Promise<void> {
    const { commentId, userId } = command;
    await this.commentRepository.unlikeComment(commentId, userId);
  }
}
