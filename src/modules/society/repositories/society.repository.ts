import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Society, Prisma } from '@prisma/client';

@Injectable()
export class SocietyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SocietyCreateInput): Promise<Society> {
    return this.prisma.society.create({ data });
  }

  async findAll(page: number, limit: number, search?: string, sort?: string): Promise<Society[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.SocietyOrderByWithRelationInput = {};
    if (sort) {
      const [field, order] = sort.split(':');
      orderBy[field] = order;
    }

    return this.prisma.society.findMany({
      skip,
      take,
      where: {
        active: true,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy,
    });
  }

  async findById(id: number): Promise<Society | null> {
    return this.prisma.society.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.SocietyUpdateInput): Promise<Society> {
    return this.prisma.society.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Society> {
    return this.prisma.society.delete({ where: { id } });
  }
}
