import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DioceseRepository } from './repositories/diocese.repository';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { DioceseController } from './diocese.controller';
import { CreateDioceseCommand, CreateDioceseHandler } from './commands/create-diocese.command';
import { UpdateDioceseCommand, UpdateDioceseHandler } from './commands/update-diocese.command';
import { DeleteDioceseCommand, DeleteDioceseHandler } from './commands/delete-diocese.command';
import { GetDioceseByIdQuery, GetDioceseByIdHandler } from './queries/get-diocese-by-id.query';
import { GetDiocesesQuery, GetDiocesesHandler } from './queries/get-dioceses.query';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [DioceseController],
  providers: [
    DioceseRepository,
    CreateDioceseCommand,
    CreateDioceseHandler,
    UpdateDioceseCommand,
    UpdateDioceseHandler,
    DeleteDioceseCommand,
    DeleteDioceseHandler,
    GetDioceseByIdQuery,
    GetDioceseByIdHandler,
    GetDiocesesQuery,
    GetDiocesesHandler,
  ],
  exports: [DioceseRepository],
})
export class DioceseModule {}
