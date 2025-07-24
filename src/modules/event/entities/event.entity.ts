import { AggregateRoot } from '@nestjs/cqrs';
import { $Enums, Event } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class EventEntity extends AggregateRoot implements Event {
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
  isPaid: boolean;
  onlineLink: string;
  coverImage: string;
  type: $Enums.EventType;
  tags: string;
  maxAttendees: number;
  price: Decimal;
  status: $Enums.EventStatus;

  get props(): Event {
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
      isPaid: this.isPaid,
      onlineLink: this.onlineLink,
      coverImage: this.coverImage,
      type: this.type,
      tags: this.tags,
      maxAttendees: this.maxAttendees,
      price: this.price,
      status: this.status,
    };
  }
}
