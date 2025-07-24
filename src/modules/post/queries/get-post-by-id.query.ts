import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repositories/post.repository';
import { PostEntity } from '../entities/post.entity';

export class GetPostByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(query: GetPostByIdQuery): Promise<PostEntity> {
    const { id } = query;
    const post = await this.postRepository.findById(id);

    return new PostEntity(post);
  }
}
