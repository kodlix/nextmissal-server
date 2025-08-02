import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ComplianceController } from './compliance.controller';
import { ComplaintRepository } from './repositories/complaint.repository';

import { CreateComplaintHandler } from './commands/create-complaint.command';
import { UpdateComplaintHandler } from './commands/update-complaint.command';
import { GetComplaintsHandler } from './queries/get-complaints.query';
import { GetComplaintByIdHandler } from './queries/get-complaint-by-id.query';

const commandHandlers = [CreateComplaintHandler, UpdateComplaintHandler];
const queryHandlers = [GetComplaintsHandler, GetComplaintByIdHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ComplianceController],
  providers: [PrismaService, ComplaintRepository, ...commandHandlers, ...queryHandlers],
})
export class ComplianceModule {}
