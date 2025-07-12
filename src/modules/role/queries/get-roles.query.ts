import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IRoleRepository } from '@modules/role/repositories/role.repository.interface';
import { RoleDetailResponse } from '@modules/role/role.response';
import { RoleMapper } from '@modules/role/role.mapper';
import { ROLE_REPOSITORY } from '@shared/constants/tokens';
import { Paginated } from '@shared/dtos/paginated.dto';

export class GetRolesQuery implements IQuery {
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

@QueryHandler(GetRolesQuery)
export class GetRolesQueryHandler implements IQueryHandler<GetRolesQuery> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRolesQuery): Promise<Paginated<RoleDetailResponse>> {
    const [roles, total] = await Promise.all([
      this.roleRepository.findAll(),
      this.roleRepository.countAll(query.search),
    ]);

    const roleDetails = roles.map(role => RoleMapper.toDetailResponse(role));

    return new Paginated<RoleDetailResponse>(roleDetails, total, query.page, query.limit);
  }
}
