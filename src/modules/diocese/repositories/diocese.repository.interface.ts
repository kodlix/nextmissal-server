import { Diocese } from '@modules/diocese/entities/diocese.entity';

export interface IDioceseRepository {
  findById(id: number): Promise<Diocese | null>;
  findByName(name: string): Promise<Diocese | null>;
  findAll(page: number, limit: number, search?: string, sort?: string): Promise<Diocese[]>;
  countAll(search?: string): Promise<number>;
  create(diocese: Diocese): Promise<Diocese>;
  update(diocese: Diocese): Promise<Diocese>;
  delete(id: number): Promise<boolean>;
}
