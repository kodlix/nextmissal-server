import { Role } from '../entities/role.entity';

/**
 * Role repository interface
 *
 * Implementations:
 * - {@link RoleRepository} - Production Prisma/PostgreSQL implementation
 */
export interface IRoleRepository {
  countAll(search: string): any;
  findById(id: bigint): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  findDefaultRole(): Promise<Role | null>;
  create(role: Role): Promise<Role>;
  update(role: Role): Promise<Role>;
  delete(id: bigint): Promise<boolean>;
}
