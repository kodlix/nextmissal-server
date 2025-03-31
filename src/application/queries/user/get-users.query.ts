import { IQuery } from '@nestjs/cqrs';

export class GetUsersQuery implements IQuery {}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@core/repositories/user.repository.interface';

@Injectable()
@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(): Promise<any> {
    const users = await this.userRepository.findAll();

    return users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      otpEnabled: user.otpEnabled,
      lastLoginAt: user.lastLoginAt,
      roles: user.roles.map(role => ({
        id: role.id,
        name: role.name,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}