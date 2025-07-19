import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { DioceseSociety, Prisma } from '@prisma/client';

@Injectable()
export class DioceseSocietyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    dioceseId: number,
    societyId: number,
    data: Prisma.DioceseSocietyCreateInput,
  ): Promise<DioceseSociety> {
    return this.prisma.dioceseSociety.upsert({
      where: {
        dioceseId_societyId: {
          dioceseId,
          societyId,
        },
      },
      update: data,
      create: data,
    });
  }

  async findManyByDioceseId(
    dioceseId: number,
    page: number,
    limit: number,
    search?: string,
    sort?: string,
    active?: boolean,
  ): Promise<DioceseSociety[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.DioceseSocietyOrderByWithRelationInput = {};
    if (sort) {
      const [field, order] = sort.split(':');
      orderBy[field] = order;
    }

    return this.prisma.dioceseSociety.findMany({
      skip,
      take,
      where: {
        dioceseId,
        ...(active !== undefined ? { active } : {}),
        ...(search
          ? {
              OR: [
                { description: { contains: search, mode: 'insensitive' } },
                { society: { name: { contains: search, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      orderBy,
      include: { society: true }, // Include society details
    });
  }
}
