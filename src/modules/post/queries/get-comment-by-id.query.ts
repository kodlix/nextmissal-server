import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentEntity } from '../entities/comment.entity';

export class GetCommentByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdHandler implements IQueryHandler<GetCommentByIdQuery> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(query: GetCommentByIdQuery): Promise<CommentEntity> {
    const { id } = query;
    const comment = await this.commentRepository.findById(id);

    return new CommentEntity(comment);
  }
}
