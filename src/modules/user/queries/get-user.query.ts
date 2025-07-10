import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@modules/user/repositories/user.repository.interface';
import { IUserDetailResponse } from '@modules/user/user.response';
import { UserMapper } from '@modules/user/user.mapper';
import { USER_REPOSITORY } from '@shared/constants/tokens';

export class GetUserQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@Injectable()
@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserQuery): Promise<IUserDetailResponse> {
    const { userId } = query;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Use the mapper to convert to response DTO
    return UserMapper.toDetailResponse(user);
  }
}
