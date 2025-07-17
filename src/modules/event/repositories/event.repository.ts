import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { event, Prisma } from '@prisma/client';

@Injectable()
export class EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.eventCreateInput): Promise<event> {
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
  ): Promise<event[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.eventOrderByWithRelationInput = {};
    if (sort) {
      const [field, order] = sort.split(':');
      orderBy[field] = order;
    }

    const where: Prisma.eventWhereInput = {
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

  async findById(id: number): Promise<event | null> {
    return this.prisma.event.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.eventUpdateInput): Promise<event> {
    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<event> {
    return this.prisma.event.delete({ where: { id } });
  }
}
