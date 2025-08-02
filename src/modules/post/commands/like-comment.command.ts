import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repositories/comment.repository';

export class LikeCommentCommand implements ICommand {
  constructor(
    public readonly commentId: number,
    public readonly userId: bigint,
  ) {}
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentHandler implements ICommandHandler<LikeCommentCommand> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: LikeCommentCommand): Promise<void> {
    const { commentId, userId } = command;
    await this.commentRepository.likeComment(commentId, userId);
  }
}
