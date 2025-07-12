import { Role } from '@modules/role/entities/role.entity';
import { Permission } from '@modules/auth/entities/permission.entity';
import { RoleDetailResponse, PermissionResponse } from '@modules/role/role.response';

export class RoleMapper {
  /**
   * Maps a Permission entity to a PermissionResponse DTO
   */
  static toPermissionResponse(permission: Permission): PermissionResponse {
    return {
      id: permission.id,
      name: permission.name.getValue(),
      description: permission.description,
      resource: permission.resourceAction.getResource(),
      action: permission.resourceAction.getAction().toString(),
    };
  }

  /**
   * Maps a Role entity to a RoleDetailResponse DTO
   */
  static toDetailResponse(role: Role): RoleDetailResponse {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isDefault: role.isDefault,
      permissions: role.permissions?.map(permission => this.toPermissionResponse(permission)) || [],
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
