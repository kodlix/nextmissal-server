import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostRepository } from '../repositories/post.repository';
import { PostEntity } from '../entities/post.entity';

export class UpdatePostCommand {
  constructor(
    public readonly id: number,
    public readonly updatePostDto: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: UpdatePostCommand): Promise<PostEntity> {
    const { id, updatePostDto } = command;
    const post = await this.postRepository.update(id, updatePostDto);

    return new PostEntity(post);
  }
}
