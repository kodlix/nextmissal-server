import { Injectable } from '@nestjs/common';
import { Diocese } from '@modules/diocese/entities/diocese.entity';
import { IDioceseRepository } from '@modules/diocese/repositories/diocese.repository.interface';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { Diocese as PrismaDiocese } from '@prisma/client';
import { BaseRepository } from '@core/repositories/base.repository';

@Injectable()
export class DioceseRepository extends BaseRepository<Diocese> implements IDioceseRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async countAll(search?: string): Promise<number> {
    return this.prisma.diocese.count({
      where: {
        active: true,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { profile: { contains: search, mode: 'insensitive' } },
              { cathedral: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
              { telephones: { contains: search, mode: 'insensitive' } },
              { emails: { contains: search, mode: 'insensitive' } },
              { province: { contains: search, mode: 'insensitive' } },
              { bishop: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
    });
  }

  async findById(id: number): Promise<Diocese | null> {
    const dioceseRecord = await this.prisma.diocese.findUnique({
      where: { id },
    });

    if (!dioceseRecord) {
      return null;
    }

    return this.mapToModel(dioceseRecord);
  }

  async findByName(name: string): Promise<Diocese | null> {
    const dioceseRecord = await this.prisma.diocese.findUnique({
      where: { name },
    });

    if (!dioceseRecord) {
      return null;
    }

    return this.mapToModel(dioceseRecord);
  }

  async findAll(page: number, limit: number, search?: string, sort?: string): Promise<Diocese[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy = sort
      ? {
          [sort.split(':')[0]]: sort.split(':')[1] as 'asc' | 'desc',
        }
      : { createdAt: 'desc' as 'asc' | 'desc' };

    const dioceseRecords = await this.prisma.diocese.findMany({
      skip,
      take,
      where: {
        active: true,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { profile: { contains: search, mode: 'insensitive' } },
              { cathedral: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
              { telephones: { contains: search, mode: 'insensitive' } },
              { emails: { contains: search, mode: 'insensitive' } },
              { province: { contains: search, mode: 'insensitive' } },
              { bishop: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy,
    });

    return dioceseRecords.map(record => this.mapToModel(record));
  }

  async create(diocese: Diocese): Promise<Diocese> {
    const createdDiocese = await this.prisma.diocese.create({
      data: {
        name: diocese.name,
        profile: diocese.profile,
        cathedral: diocese.cathedral,
        address: diocese.address,
        telephones: diocese.telephones,
        emails: diocese.emails,
        province: diocese.province,
        bishop: diocese.bishop,
        isArchidiocese: diocese.isArchidiocese,
        countryId: diocese.countryId,
        active: diocese.active,
        createdBy: diocese.createdBy,
      },
    });

    return this.mapToModel(createdDiocese);
  }

  async update(diocese: Diocese): Promise<Diocese> {
    const updatedDiocese = await this.prisma.diocese.update({
      where: { id: diocese.id },
      data: {
        name: diocese.name,
        profile: diocese.profile,
        cathedral: diocese.cathedral,
        address: diocese.address,
        telephones: diocese.telephones,
        emails: diocese.emails,
        province: diocese.province,
        bishop: diocese.bishop,
        isArchidiocese: diocese.isArchidiocese,
        countryId: diocese.countryId,
        active: diocese.active,
        updatedBy: diocese.updatedBy,
      },
    });

    return this.mapToModel(updatedDiocese);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.diocese.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }

  private mapToModel(record: PrismaDiocese): Diocese {
    return Diocese.fromData({
      id: record.id,
      name: record.name,
      profile: record.profile,
      cathedral: record.cathedral || undefined,
      address: record.address || undefined,
      telephones: record.telephones || undefined,
      emails: record.emails || undefined,
      province: record.province || undefined,
      bishop: record.bishop || undefined,
      isArchidiocese: record.isArchidiocese,
      countryId: record.countryId,
      active: record.active,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      createdBy: record.createdBy || undefined,
      updatedBy: record.updatedBy || undefined,
    });
  }
}
