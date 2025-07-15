import { Denary } from '../entities/denary.entity';

export interface IDenaryRepository {
  findById(id: number): Promise<Denary | null>;
  findAll(page: number, limit: number, search?: string, sort?: string): Promise<Denary[]>;
  countAll(search?: string): Promise<number>;
  create(denary: Denary): Promise<Denary>;
  update(denary: Denary): Promise<Denary>;
  delete(id: number): Promise<boolean>;
}
