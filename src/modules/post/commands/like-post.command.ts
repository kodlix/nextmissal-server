import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repositories/post.repository';

export class LikePostCommand implements ICommand {
  constructor(
    public readonly postId: number,
    public readonly userId: bigint,
  ) {}
}

@CommandHandler(LikePostCommand)
export class LikePostHandler implements ICommandHandler<LikePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: LikePostCommand): Promise<void> {
    const { postId, userId } = command;
    await this.postRepository.likePost(postId, userId);
  }
}
