import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentEntity } from '../entities/comment.entity';

export class CreateCommentCommand {
  constructor(
    public readonly createCommentDto: CreateCommentDto,
    public readonly userId: bigint,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: CreateCommentCommand): Promise<CommentEntity> {
    const { createCommentDto, userId } = command;
    const comment = await this.commentRepository.create({
      ...createCommentDto,
      post: { connect: { id: createCommentDto.postId } },
      author: { connect: { id: userId } },
    });

    return new CommentEntity(comment);
  }
}
