import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { EventAttendee, Prisma, AttendanceStatus } from '@prisma/client';

@Injectable()
export class EventAttendeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EventAttendeeCreateInput): Promise<EventAttendee> {
    return this.prisma.eventAttendee.create({ data });
  }

  async findOne(userId: bigint, eventId: number): Promise<EventAttendee | null> {
    return this.prisma.eventAttendee.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });
  }

  async update(
    userId: bigint,
    eventId: number,
    data: Prisma.EventAttendeeUpdateInput,
  ): Promise<EventAttendee> {
    return this.prisma.eventAttendee.update({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      data,
    });
  }

  async findAll(
    page: number,
    limit: number,
    eventId: number,
    search?: string,
    sort?: string,
    status?: AttendanceStatus,
    userId?: bigint,
  ): Promise<EventAttendee[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.EventAttendeeOrderByWithRelationInput = {};
    if (sort) {
      const [field, order] = sort.split(':');
      orderBy[field] = order;
    }

    const where: Prisma.EventAttendeeWhereInput = {
      eventId,
      ...(status ? { status } : {}),
      ...(userId ? { userId } : {}),
      ...(search
        ? {
            OR: [
              { user: { firstName: { contains: search, mode: 'insensitive' } } },
              { user: { lastName: { contains: search, mode: 'insensitive' } } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    return this.prisma.eventAttendee.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { user: true, event: true }, // Include user and event details
    });
  }

  async delete(userId: bigint, eventId: number): Promise<EventAttendee> {
    return this.prisma.eventAttendee.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });
  }
}
