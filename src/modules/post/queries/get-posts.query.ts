import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repositories/post.repository';
import { PostEntity } from '../entities/post.entity';
import { GetPostsDto } from '../dtos/get-posts.dto';

export class GetPostsQuery implements IQuery {
  constructor(public readonly getPostsDto: GetPostsDto) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(query: GetPostsQuery): Promise<PostEntity[]> {
    const { getPostsDto } = query;
    const { page = 1, limit = 10, search, sort } = getPostsDto;

    const posts = await this.postRepository.findAll(Number(page), Number(limit), search, sort);

    return posts.map(post => new PostEntity(post));
  }
}
