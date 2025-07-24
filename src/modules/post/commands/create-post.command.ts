import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostRepository } from '../repositories/post.repository';
import { PostEntity } from '../entities/post.entity';

export class CreatePostCommand {
  constructor(
    public readonly createPostDto: CreatePostDto,
    public readonly userId: bigint,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: CreatePostCommand): Promise<PostEntity> {
    const { createPostDto, userId } = command;
    const post = await this.postRepository.create({
      ...createPostDto,
      author: { connect: { id: userId } },
    });

    return new PostEntity(post);
  }
}
