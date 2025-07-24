import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repositories/post.repository';

export class DeletePostCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { id } = command;
    await this.postRepository.delete(id);
  }
}
