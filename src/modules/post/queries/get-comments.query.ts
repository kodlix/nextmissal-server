import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentEntity } from '../entities/comment.entity';
import { GetCommentsDto } from '../dtos/get-comments.dto';

export class GetCommentsQuery implements IQuery {
  constructor(public readonly getCommentsDto: GetCommentsDto) {}
}

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(query: GetCommentsQuery): Promise<CommentEntity[]> {
    const { getCommentsDto } = query;
    const { page = 1, limit = 10, postId, parentId, search, sort } = getCommentsDto;

    const comments = await this.commentRepository.findAll(
      Number(page),
      Number(limit),
      postId,
      parentId,
      search,
      sort,
    );

    return comments.map(comment => new CommentEntity(comment));
  }
}
