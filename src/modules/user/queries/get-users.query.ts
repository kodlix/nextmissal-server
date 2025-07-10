import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@modules/user/repositories/user.repository.interface';
import { IUserDetailResponse } from '@modules/user/user.response';
import { UserMapper } from '@modules/user/user.mapper';
import { USER_REPOSITORY } from '@shared/constants/tokens';

export class GetUsersQuery implements IQuery {}

@Injectable()
@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<IUserDetailResponse[]> {
    const users = await this.userRepository.findAll();

    // Use the mapper to convert each user to response DTO
    return users.map(user => UserMapper.toDetailResponse(user));
  }
}
