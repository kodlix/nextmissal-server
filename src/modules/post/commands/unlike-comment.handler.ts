import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnlikeCommentCommand } from './unlike-comment.command';
import { CommentRepository } from '../repositories/comment.repository';

@CommandHandler(UnlikeCommentCommand)
export class UnlikeCommentHandler implements ICommandHandler<UnlikeCommentCommand> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: UnlikeCommentCommand): Promise<void> {
    const { commentId, userId } = command;
    await this.commentRepository.unlikeComment(commentId, userId);
  }
}
