import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikePostCommand } from './like-post.command';
import { PostRepository } from '../repositories/post.repository';

@CommandHandler(LikePostCommand)
export class LikePostHandler implements ICommandHandler<LikePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: LikePostCommand): Promise<void> {
    const { postId, userId } = command;
    await this.postRepository.likePost(postId, userId);
  }
}
