import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { UpdateComplaintDto } from '../dto/update-complaint.dto';
import { CreateComplaintDto } from '../dto/create-complaint.dto';

@Injectable()
export class ComplaintRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createComplaintDto: CreateComplaintDto, reporterUserId: bigint) {
    return this.prisma.complaint.create({
      data: {
        ...createComplaintDto,
        reporterUserId,
      },
    });
  }

  async findAll() {
    return this.prisma.complaint.findMany();
  }

  async findById(id: number) {
    return this.prisma.complaint.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateComplaintDto) {
    return this.prisma.complaint.update({ where: { id }, data });
  }
}
