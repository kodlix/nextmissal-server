import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeCommentCommand } from './like-comment.command';
import { CommentRepository } from '../repositories/comment.repository';

@CommandHandler(LikeCommentCommand)
export class LikeCommentHandler implements ICommandHandler<LikeCommentCommand> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: LikeCommentCommand): Promise<void> {
    const { commentId, userId } = command;
    await this.commentRepository.likeComment(commentId, userId);
  }
}
