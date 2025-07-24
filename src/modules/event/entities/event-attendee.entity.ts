import { AggregateRoot } from '@nestjs/cqrs';
import { EventAttendee, AttendanceStatus } from '@prisma/client';

export class EventAttendeeEntity extends AggregateRoot implements EventAttendee {
  Id: number;
  userId: bigint;
  eventId: number;
  status: AttendanceStatus;
  createdAt: Date;

  constructor(properties: Partial<EventAttendeeEntity>) {
    super();
    Object.assign(this, properties);
  }

  get props(): EventAttendee {
    return {
      userId: this.userId,
      eventId: this.eventId,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
