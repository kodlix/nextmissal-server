import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IRoleRepository } from '@core/repositories/role.repository.interface';
import { RoleDetailResponse } from '@application/dtos/responses/role.response';

export class GetRolesQuery implements IQuery {}

@QueryHandler(GetRolesQuery)
export class GetRolesQueryHandler implements IQueryHandler<GetRolesQuery> {
  constructor(
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository
  ) {}

  async execute(): Promise<RoleDetailResponse[]> {
    const roles = await this.roleRepository.findAll();

    return roles.map(role => ({
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
    }));
  }
}