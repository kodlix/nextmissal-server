import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentDto } from '../dtos/update-comment.dto';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentEntity } from '../entities/comment.entity';

export class UpdateCommentCommand {
  constructor(
    public readonly id: number,
    public readonly updateCommentDto: UpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler implements ICommandHandler<UpdateCommentCommand> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: UpdateCommentCommand): Promise<CommentEntity> {
    const { id, updateCommentDto } = command;
    const comment = await this.commentRepository.update(id, updateCommentDto);

    return new CommentEntity(comment);
  }
}
