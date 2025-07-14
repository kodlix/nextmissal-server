import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';

@Injectable()
export class StateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.state.findUnique({
      where: { id },
    });
  }

  async findByCountryId(countryId: number) {
    return this.prisma.state.findMany({
      where: { countryId },
    });
  }
}
