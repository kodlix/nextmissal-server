import { AggregateRoot } from '@nestjs/cqrs';
import { DioceseSociety } from '@prisma/client';

export class DioceseSocietyEntity extends AggregateRoot implements DioceseSociety {
  id: number;
  dioceseId: number;
  societyId: number;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;

  constructor(properties: Partial<DioceseSocietyEntity>) {
    super();
    Object.assign(this, properties);
  }

  get props(): DioceseSociety {
    return {
      id: this.id,
      dioceseId: this.dioceseId,
      societyId: this.societyId,
      description: this.description,
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
    };
  }
}
