import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnlikePostCommand } from './unlike-post.command';
import { PostRepository } from '../repositories/post.repository';

@CommandHandler(UnlikePostCommand)
export class UnlikePostHandler implements ICommandHandler<UnlikePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: UnlikePostCommand): Promise<void> {
    const { postId, userId } = command;
    await this.postRepository.unlikePost(postId, userId);
  }
}
