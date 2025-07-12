import { Otp } from '../entities/otp.entity';

/**
 * OTP (One-Time Password) repository interface
 *
 * Implementations:
 * - {@link OtpRepository} - Production Prisma/PostgreSQL implementation
 */
export interface IOtpRepository {
  findById(id: bigint): Promise<Otp | null>;
  findByUserId(userId: bigint): Promise<Otp | null>;
  create(otp: Otp): Promise<Otp>;
  update(otp: Otp): Promise<Otp>;
  delete(id: bigint): Promise<boolean>;
}
