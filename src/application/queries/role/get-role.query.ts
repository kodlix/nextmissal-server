import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IRoleRepository } from '@core/repositories/role.repository.interface';
import { RoleDetailResponse } from '@application/dtos/responses/role.response';
import { EntityNotFoundException } from '@core/exceptions/domain-exceptions';
import { RoleMapper } from '@application/mappers/role.mapper';

export class GetRoleQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetRoleQuery)
export class GetRoleQueryHandler implements IQueryHandler<GetRoleQuery> {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRoleQuery): Promise<RoleDetailResponse> {
    const { id } = query;
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new EntityNotFoundException('Role', id);
    }

    // Use the mapper to convert to response DTO
    return RoleMapper.toDetailResponse(role);
  }
}
