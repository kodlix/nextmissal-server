import { Parish } from '@modules/parish/entities/parish.entity';

export interface IParishRepository {
  findById(id: number): Promise<Parish | null>;
  findAll(page: number, limit: number, search?: string, sort?: string): Promise<Parish[]>;
  countAll(search?: string): Promise<number>;
  create(parish: Parish): Promise<Parish>;
  update(parish: Parish): Promise<Parish>;
  delete(id: number): Promise<boolean>;
}
