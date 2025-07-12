import { RefreshToken } from '../entities/refresh-token.entity';

/**
 * Refresh token repository interface
 *
 * Implementations:
 * - {@link RefreshTokenRepository} - Production Prisma/PostgreSQL implementation
 */
export interface IRefreshTokenRepository {
  findById(id: bigint): Promise<RefreshToken | null>;
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: bigint): Promise<RefreshToken[]>;
  create(token: RefreshToken): Promise<RefreshToken>;
  update(token: RefreshToken): Promise<RefreshToken>;
  deleteByUserId(userId: bigint): Promise<boolean>;
  deleteExpired(): Promise<number>;
}
