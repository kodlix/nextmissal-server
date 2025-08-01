import { Module } from '@nestjs/common';
import { ReadingsController } from './readings.controller';
import { HttpModule } from '@nestjs/axios';
import { GetDailyReadingsHandler } from './queries/get-daily-readings.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, HttpModule],
  controllers: [ReadingsController],
  providers: [GetDailyReadingsHandler],
})
export class ReadingsModule {}
