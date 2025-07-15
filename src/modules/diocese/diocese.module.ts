import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DioceseRepository } from './repositories/diocese.repository';
import { PrismaModule } from '@core/database/prisma/prisma.module';

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [DioceseRepository],
  exports: [DioceseRepository],
})
export class DioceseModule {}
