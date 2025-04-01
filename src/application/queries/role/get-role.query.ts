import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IRoleRepository } from '@core/repositories/role.repository.interface';
import { RoleDetailResponse } from '@application/dtos/responses/role.response';
import { EntityNotFoundException } from '@core/exceptions/domain-exceptions';

export class GetRoleQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetRoleQuery)
export class GetRoleQueryHandler implements IQueryHandler<GetRoleQuery> {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository
  ) {}

  async execute(query: GetRoleQuery): Promise<RoleDetailResponse> {
    const { id } = query;
    const role = await this.roleRepository.findById(id);
    
    if (!role) {
      throw new EntityNotFoundException('Role', id);
    }

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isDefault: role.isDefault,
      permissions: role.permissions?.map(permission => ({
        id: permission.id,
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
        action: permission.action,
      })) || [],
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}