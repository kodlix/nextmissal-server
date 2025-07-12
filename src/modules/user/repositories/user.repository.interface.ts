import { User } from '../entities/user.entity';
import { GetUsersQuery } from '../queries/get-users.query';

/**
 * User repository interface
 *
 * Implementations:
 * - {@link UserRepository} - Production Prisma/PostgreSQL implementation
 */
export interface IUserRepository {
  countAll(query: GetUsersQuery): any;
  findById(id: bigint): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(query: GetUsersQuery): Promise<User[]>;
  findUsersByRoleId(roleId: bigint): Promise<User[]>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: bigint): Promise<boolean>;
}
