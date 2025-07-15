import { Injectable } from '@nestjs/common';
import { Denary } from '@modules/denary/entities/denary.entity';
import { IDenaryRepository } from '@modules/denary/repositories/denary.repository.interface';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { Denary as PrismaDenary } from '@prisma/client';
import { BaseRepository } from '@core/repositories/base.repository';

@Injectable()
export class DenaryRepository extends BaseRepository<Denary> implements IDenaryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async countAll(search?: string): Promise<number> {
    return this.prisma.denary.count({
      where: {
        active: true,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { dean: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
              { profile: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
    });
  }

  async findById(id: number): Promise<Denary | null> {
    const denaryRecord = await this.prisma.denary.findUnique({
      where: { id },
    });

    if (!denaryRecord) {
      return null;
    }

    return this.mapToModel(denaryRecord);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    sort?: string,
    dioceseId?: number,
  ): Promise<Denary[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy = sort
      ? {
          [sort.split(':')[0]]: sort.split(':')[1] as 'asc' | 'desc',
        }
      : { createdAt: 'desc' as 'asc' | 'desc' };

    const denaryRecords = await this.prisma.denary.findMany({
      skip,
      take,
      where: {
        active: true,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { profile: { contains: search, mode: 'insensitive' } },
              { dean: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
        ...(dioceseId && { dioceseId }),
      },
      orderBy,
    });

    return denaryRecords.map(record => this.mapToModel(record));
  }

  async create(denary: Denary): Promise<Denary> {
    const createdDenary = await this.prisma.denary.create({
      data: {
        name: denary.name,
        dean: denary.dean,
        address: denary.address,
        dioceseId: denary.dioceseId,
        profile: denary.profile,
        active: denary.active,
        createdBy: denary.createdBy,
      },
    });

    return this.mapToModel(createdDenary);
  }

  async update(denary: Denary): Promise<Denary> {
    const updatedDenary = await this.prisma.denary.update({
      where: { id: denary.id },
      data: {
        name: denary.name,
        dean: denary.dean,
        address: denary.address,
        dioceseId: denary.dioceseId,
        profile: denary.profile,
        active: denary.active,
        updatedBy: denary.updatedBy,
      },
    });

    return this.mapToModel(updatedDenary);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.denary.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }

  private mapToModel(record: PrismaDenary): Denary {
    return Denary.fromData({
      id: record.id,
      name: record.name,
      dean: record.dean,
      address: record.address,
      dioceseId: record.dioceseId,
      profile: record.profile,
      active: record.active,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      createdBy: record.createdBy || undefined,
      updatedBy: record.updatedBy || undefined,
    });
  }
}
