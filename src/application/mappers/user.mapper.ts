import { User } from '@core/entities/user.entity';
import { Role } from '@core/entities/role.entity';
import { 
  UserBaseResponse,
  UserDetailResponse,
  UserRoleResponse,
  UserWithAuthResponse
} from '@application/dtos/responses/user.response';

export class UserMapper {
  /**
   * Maps a Role entity to a UserRoleResponse DTO
   */
  static toRoleResponse(role: Role): UserRoleResponse {
    return {
      id: role.id,
      name: role.name
    };
  }

  /**
   * Maps a User entity to a UserBaseResponse DTO
   */
  static toBaseResponse(user: User, emailVerified: boolean = false): UserBaseResponse {
    return {
      id: user.id,
      email: user.email.getValue(),
      firstName: user.firstName.getValue(),
      lastName: user.lastName.getValue(),
      emailVerified
    };
  }

  /**
   * Maps a User entity to a UserDetailResponse DTO
   */
  static toDetailResponse(user: User, emailVerified: boolean = false): UserDetailResponse {
    return {
      ...this.toBaseResponse(user, emailVerified),
      isActive: user.isActive,
      otpEnabled: user.otpEnabled,
      lastLoginAt: user.lastLoginAt,
      roles: user.roles?.map(role => this.toRoleResponse(role)) || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Maps a User entity to a UserWithAuthResponse DTO
   */
  static toAuthResponse(user: User, emailVerified: boolean = false): UserWithAuthResponse {
    return {
      ...this.toBaseResponse(user, emailVerified),
      roles: user.roles?.map(role => this.toRoleResponse(role)) || []
    };
  }
}