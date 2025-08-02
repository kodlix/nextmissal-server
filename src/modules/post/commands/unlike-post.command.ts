import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repositories/post.repository';

export class UnlikePostCommand implements ICommand {
  constructor(
    public readonly postId: number,
    public readonly userId: bigint,
  ) {}
}

@CommandHandler(UnlikePostCommand)
export class UnlikePostHandler implements ICommandHandler<UnlikePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: UnlikePostCommand): Promise<void> {
    const { postId, userId } = command;
    await this.postRepository.unlikePost(postId, userId);
  }
}
