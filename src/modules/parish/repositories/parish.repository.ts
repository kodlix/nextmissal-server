import { Injectable } from '@nestjs/common';
import { Parish } from '@modules/parish/entities/parish.entity';
import { IParishRepository } from '@modules/parish/repositories/parish.repository.interface';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { Parish as PrismaParish } from '@prisma/client';
import { BaseRepository } from '@core/repositories/base.repository';

@Injectable()
export class ParishRepository extends BaseRepository<Parish> implements IParishRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async countAll(search?: string): Promise<number> {
    return this.prisma.parish.count({
      where: {
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
              { town: { contains: search, mode: 'insensitive' } },
              { lga: { contains: search, mode: 'insensitive' } },
              { state: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
    });
  }

  async findById(id: number): Promise<Parish | null> {
    const parishRecord = await this.prisma.parish.findUnique({
      where: { id },
    });

    if (!parishRecord) {
      return null;
    }

    return this.mapToModel(parishRecord);
  }

  async findAll(page: number, limit: number, search?: string, sort?: string): Promise<Parish[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy = sort
      ? {
          [sort.split(':')[0]]: sort.split(':')[1] as 'asc' | 'desc',
        }
      : { createdAt: 'desc' as 'asc' | 'desc' };

    const parishRecords = await this.prisma.parish.findMany({
      skip,
      take,
      where: {
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
              { town: { contains: search, mode: 'insensitive' } },
              { lga: { contains: search, mode: 'insensitive' } },
              { state: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy,
    });

    return parishRecords.map(record => this.mapToModel(record));
  }

  async create(parish: Parish): Promise<Parish> {
    const createdParish = await this.prisma.parish.create({
      data: {
        name: parish.name,
        profile: parish.profile,
        email: parish.email,
        telephone: parish.telephone,
        slogan: parish.slogan,
        address: parish.address,
        town: parish.town,
        lga: parish.lga,
        state: parish.state,
        postOfficeAddress: parish.postOfficeAddress,
        website: parish.website,
        logo: parish.logo,
        vision: parish.vision,
        mission: parish.mission,
        establishedOn: parish.establishedOn,
        active: parish.active,
        isStation: parish.isStation,
        parentParishId: parish.parentParishId,
        denaryId: parish.denaryId,
        parishPriest: parish.parishPriest,
        assistantPriest1: parish.assistantPriest1,
        assistantPriest2: parish.assistantPriest2,
        parishPriestPhoneNumber: parish.parishPriestPhoneNumber,
        assistantPriest1PhoneNumber: parish.assistantPriest1PhoneNumber,
        assistantPriest2PhoneNumber: parish.assistantPriest2PhoneNumber,
        createdBy: parish.createdBy,
      },
    });

    return this.mapToModel(createdParish);
  }

  async update(parish: Parish): Promise<Parish> {
    const updatedParish = await this.prisma.parish.update({
      where: { id: parish.id },
      data: {
        name: parish.name,
        profile: parish.profile,
        email: parish.email,
        telephone: parish.telephone,
        slogan: parish.slogan,
        address: parish.address,
        town: parish.town,
        lga: parish.lga,
        state: parish.state,
        postOfficeAddress: parish.postOfficeAddress,
        website: parish.website,
        logo: parish.logo,
        vision: parish.vision,
        mission: parish.mission,
        establishedOn: parish.establishedOn,
        active: parish.active,
        isStation: parish.isStation,
        parentParishId: parish.parentParishId,
        denaryId: parish.denaryId,
        parishPriest: parish.parishPriest,
        assistantPriest1: parish.assistantPriest1,
        assistantPriest2: parish.assistantPriest2,
        parishPriestPhoneNumber: parish.parishPriestPhoneNumber,
        assistantPriest1PhoneNumber: parish.assistantPriest1PhoneNumber,
        assistantPriest2PhoneNumber: parish.assistantPriest2PhoneNumber,
        updatedBy: parish.updatedBy,
      },
    });

    return this.mapToModel(updatedParish);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.parish.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }

  private mapToModel(record: PrismaParish): Parish {
    return Parish.fromData({
      id: record.id,
      name: record.name,
      profile: record.profile || undefined,
      email: record.email || undefined,
      telephone: record.telephone || undefined,
      slogan: record.slogan || undefined,
      address: record.address,
      town: record.town,
      lga: record.lga || undefined,
      state: record.state,
      postOfficeAddress: record.postOfficeAddress || undefined,
      website: record.website || undefined,
      logo: record.logo || undefined,
      vision: record.vision || undefined,
      mission: record.mission || undefined,
      establishedOn: record.establishedOn || undefined,
      active: record.active,
      isStation: record.isStation,
      parentParishId: record.parentParishId || undefined,
      denaryId: record.denaryId || undefined,
      parishPriest: record.parishPriest || undefined,
      assistantPriest1: record.assistantPriest1 || undefined,
      assistantPriest2: record.assistantPriest2 || undefined,
      parishPriestPhoneNumber: record.parishPriestPhoneNumber || undefined,
      assistantPriest1PhoneNumber: record.assistantPriest1PhoneNumber || undefined,
      assistantPriest2PhoneNumber: record.assistantPriest2PhoneNumber || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      createdBy: record.createdBy || undefined,
      updatedBy: record.updatedBy || undefined,
    });
  }
}
