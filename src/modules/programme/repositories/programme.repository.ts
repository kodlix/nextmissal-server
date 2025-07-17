import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Programme, Prisma, ProgrammeFrequency } from '@prisma/client';

@Injectable()
export class ProgrammeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProgrammeCreateInput): Promise<Programme> {
    return this.prisma.programme.create({ data });
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    sort?: string,
    active?: boolean,
    programmeType?: string,
    isGeneral?: boolean,
    frequency?: ProgrammeFrequency,
    parishId?: number,
    denaryId?: number,
    dioceseId?: number,
    societyId?: number,
  ): Promise<Programme[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.ProgrammeOrderByWithRelationInput = {};
    if (sort) {
      const [field, order] = sort.split(':');
      orderBy[field] = order;
    }

    const where: Prisma.ProgrammeWhereInput = {
      ...(active !== undefined ? { active } : {}),
      ...(programmeType ? { programmeType } : {}),
      ...(isGeneral !== undefined ? { isGeneral } : {}),
      ...(frequency ? { frequency } : {}),
      ...(parishId ? { parishId } : {}),
      ...(denaryId ? { denaryId } : {}),
      ...(dioceseId ? { dioceseId } : {}),
      ...(societyId ? { societyId } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { hint: { contains: search, mode: 'insensitive' } },
              { venue: { contains: search, mode: 'insensitive' } },
              { frequencyInfo: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.programme.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async findById(id: number): Promise<Programme | null> {
    return this.prisma.programme.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.ProgrammeUpdateInput): Promise<Programme> {
    return this.prisma.programme.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Programme> {
    return this.prisma.programme.delete({ where: { id } });
  }
}
