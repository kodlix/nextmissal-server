import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DenaryRepository } from './repositories/denary.repository';
import { PrismaModule } from '@core/database/prisma/prisma.module';

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [DenaryRepository],
  exports: [DenaryRepository],
})
export class DeaneryModule {}
