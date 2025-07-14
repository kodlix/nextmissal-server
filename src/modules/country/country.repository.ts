import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';

@Injectable()
export class CountryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skip?: number, take?: number, search?: string) {
    return this.prisma.country.findMany({
      skip,
      take,
      where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
    });
  }

  async countAllCountries(search?: string) {
    return this.prisma.country.count({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
    });
  }

  async findAllWithStates(countryId: number, includeLgas: boolean) {
    return this.prisma.country.findMany({
      where: { id: countryId },
      include: {
        states: {
          include: {
            lgas: includeLgas,
          },
        },
      },
    });
  }

  async findStateWithLgas(countryId: number, id: number) {
    return this.prisma.state.findUnique({
      where: { id: id, countryId: countryId },
      select: {
        id: true,
        name: true,
        countryId: true,
        lgas: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
