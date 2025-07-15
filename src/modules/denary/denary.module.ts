import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DenaryRepository } from './repositories/denary.repository';
import { PrismaModule } from '@core/database/prisma/prisma.module';
import { DenaryController } from './denary.controller';
import { CreateDenaryCommand, CreateDenaryHandler } from './commands/create-denary.command';
import { DeleteDenaryCommand, DeleteDenaryHandler } from './commands/delete-denary.command';
import { UpdateDenaryCommand, UpdateDenaryHandler } from './commands/update-denary.command';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [DenaryController],
  providers: [
    DenaryRepository,
    CreateDenaryCommand,
    CreateDenaryHandler,
    UpdateDenaryCommand,
    UpdateDenaryHandler,
    DeleteDenaryCommand,
    DeleteDenaryHandler,
  ],
  exports: [DenaryRepository],
})
export class DenaryModule {}
