import { File } from '../entities/file.entity';

/**
 * File repository interface
 *
 * Implementations:
 * - {@link FileRepository} - Production Prisma/PostgreSQL implementation
 */
export interface IFileRepository {
  findById(id: bigint): Promise<File | null>;
  findByUserId(userId: bigint, page: number, limit: number): Promise<File[]>;
  countByUserId(userId: bigint): Promise<number>;
  save(file: File): Promise<File>;
  update(file: File): Promise<File>;
  delete(id: bigint): Promise<void>;
  findByPath(path: string): Promise<File | null>;
}
