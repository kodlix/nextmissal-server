import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Event, Prisma } from '@prisma/client';

@Injectable()
export class EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({ data });
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    sort?: string,
    isPublic?: boolean,
    startDate?: Date,
    endDate?: Date,
    parishId?: number,
    denaryId?: number,
    dioceseId?: number,
    societyId?: number,
  ): Promise<Event[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.EventOrderByWithRelationInput = {};
    if (sort) {
      const [field, order] = sort.split(':');
      orderBy[field] = order;
    }

    const where: Prisma.EventWhereInput = {
      ...(isPublic !== undefined ? { isPublic } : {}),
      ...(startDate ? { startDate: { gte: startDate } } : {}),
      ...(endDate ? { endDate: { lte: endDate } } : {}),
      ...(parishId ? { parishId } : {}),
      ...(denaryId ? { denaryId } : {}),
      ...(dioceseId ? { dioceseId } : {}),
      ...(societyId ? { societyId } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.event.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async findById(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.EventUpdateInput): Promise<Event> {
    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Event> {
    return this.prisma.event.delete({ where: { id } });
  }
}
