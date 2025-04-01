import { IQuery } from '@nestjs/cqrs';

export class GetUsersQuery implements IQuery {}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@core/repositories/user.repository.interface';
import { UserDetailResponse } from '@application/dtos/responses/user.response';
import { UserMapper } from '@application/mappers/user.mapper';

@Injectable()
@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(): Promise<UserDetailResponse[]> {
    const users = await this.userRepository.findAll();

    // Use the mapper to convert each user to response DTO
    return users.map(user => UserMapper.toDetailResponse(user));
  }
}