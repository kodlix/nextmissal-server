import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma/prisma.service';

@Injectable()
export class LgaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.lga.findUnique({
      where: { id },
    });
  }

  async findByStateId(stateId: number) {
    return this.prisma.lga.findMany({
      where: { stateId },
    });
  }
}
