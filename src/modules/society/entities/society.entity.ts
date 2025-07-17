import { AggregateRoot } from '@nestjs/cqrs';
import { Society } from '@prisma/client';

export class SocietyEntity extends AggregateRoot implements Society {
  id: number;
  name: string;
  shortName: string;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;

  constructor(properties: Partial<SocietyEntity>) {
    super();
    Object.assign(this, properties);
  }

  get props(): Society {
    return {
      id: this.id,
      name: this.name,
      shortName: this.shortName,
      description: this.description,
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
    };
  }
}
