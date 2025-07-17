import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { SocietyController } from './society.controller';
import { SocietyRepository } from './repositories/society.repository';
import { DioceseSocietyRepository } from './repositories/diocese-society.repository';
import { CreateSocietyHandler } from './commands/create-society.command';
import { UpdateSocietyHandler } from './commands/update-society.command';
import { DeleteSocietyHandler } from './commands/delete-society.command';
import { MapSocietiesToDioceseHandler } from './commands/map-societies-to-diocese.command';
import { GetAllSocietiesHandler } from './queries/get-all-societies.query';
import { GetSocietyByIdHandler } from './queries/get-society-by-id.query';
import { GetMappedSocietiesHandler } from './queries/get-mapped-societies.query';

const commandHandlers = [
  CreateSocietyHandler,
  UpdateSocietyHandler,
  DeleteSocietyHandler,
  MapSocietiesToDioceseHandler,
];

const queryHandlers = [GetAllSocietiesHandler, GetSocietyByIdHandler, GetMappedSocietiesHandler];

@Module({
  imports: [CqrsModule],
  controllers: [SocietyController],
  providers: [
    PrismaService,
    SocietyRepository,
    DioceseSocietyRepository,
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class SocietyModule {}
