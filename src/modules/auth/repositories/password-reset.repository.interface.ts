import { PasswordReset } from '../entities/password-reset.entity';

/**
 * Password reset repository interface
 *
 * Implementations:
 * - {@link PasswordResetRepository} - Production Prisma/PostgreSQL implementation
 */
export interface IPasswordResetRepository {
  findById(id: bigint): Promise<PasswordReset | null>;
  findByUserId(userId: bigint): Promise<PasswordReset | null>;
  findByToken(token: string): Promise<PasswordReset | null>;
  findByEmail(email: string): Promise<PasswordReset | null>;
  create(passwordReset: PasswordReset): Promise<PasswordReset>;
  update(passwordReset: PasswordReset): Promise<PasswordReset>;
  delete(id: bigint): Promise<boolean>;
  deleteByUserId(userId: bigint): Promise<boolean>;
  deleteByEmail(email: string): Promise<boolean>;
}
