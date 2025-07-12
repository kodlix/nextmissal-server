import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@modules/user/repositories/user.repository.interface';
import { IUserDetailResponse } from '@modules/user/user.response';
import { UserMapper } from '@modules/user/user.mapper';
import { USER_REPOSITORY } from '@shared/constants/tokens';
import { Paginated } from '@shared/dtos/paginated.dto';

export class GetUsersQuery implements IQuery {
  readonly page: number;
  readonly limit: number;
  readonly search?: string;
  readonly sort?: string;

  constructor(page: number, limit: number, search?: string, sort?: string) {
    this.page = page;
    this.limit = limit;
    this.search = search;
    this.sort = sort;
  }
}

@Injectable()
@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUsersQuery): Promise<Paginated<IUserDetailResponse>> {
    const [users, total] = await Promise.all([
      this.userRepository.findAll(query),
      this.userRepository.countAll(query),
    ]);

    const userDetails = users.map(user => UserMapper.toDetailResponse(user));

    return new Paginated<IUserDetailResponse>(userDetails, total, query.page, query.limit);
  }
}
