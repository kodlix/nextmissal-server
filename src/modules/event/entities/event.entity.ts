import { AggregateRoot } from '@nestjs/cqrs';
import { event } from '@prisma/client';

export class EventEntity extends AggregateRoot implements event {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string | null;
  isPublic: boolean | null;
  parishId: number | null;
  denaryId: number | null;
  dioceseId: number | null;
  societyId: number | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number | null;
  updatedBy: number | null;

  constructor(properties: Partial<EventEntity>) {
    super();
    Object.assign(this, properties);
  }

  get props(): event {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      location: this.location,
      isPublic: this.isPublic,
      parishId: this.parishId,
      denaryId: this.denaryId,
      dioceseId: this.dioceseId,
      societyId: this.societyId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
    };
  }
}
