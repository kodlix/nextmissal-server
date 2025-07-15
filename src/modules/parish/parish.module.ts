import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ParishController } from './parish.controller';
import { ParishRepository } from './repositories/parish.repository';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { CreateParishCommand, CreateParishHandler } from './commands/create-parish.command';
import { UpdateParishCommand, UpdateParishHandler } from './commands/update-parish.command';
import { DeleteParishCommand, DeleteParishHandler } from './commands/delete-parish.command';
import { GetParishByIdQuery, GetParishByIdHandler } from './queries/get-parish-by-id.query';
import { GetParishesQuery, GetParishesHandler } from './queries/get-parishes.query';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [ParishController],
  providers: [
    ParishRepository,
    CreateParishCommand,
    CreateParishHandler,
    UpdateParishCommand,
    UpdateParishHandler,
    DeleteParishCommand,
    DeleteParishHandler,
    GetParishByIdQuery,
    GetParishByIdHandler,
    GetParishesQuery,
    GetParishesHandler,
  ],
  exports: [ParishRepository],
})
export class ParishModule {}
