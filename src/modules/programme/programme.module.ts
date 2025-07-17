import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ProgrammeController } from './programme.controller';
import { ProgrammeRepository } from './repositories/programme.repository';
import { CreateProgrammeHandler } from './commands/create-programme.command';
import { UpdateProgrammeHandler } from './commands/update-programme.command';
import { DeleteProgrammeHandler } from './commands/delete-programme.command';
import { GetProgrammeByIdHandler } from './queries/get-programme-by-id.query';
import { GetProgrammesHandler } from './queries/get-programmes.query';

const commandHandlers = [CreateProgrammeHandler, UpdateProgrammeHandler, DeleteProgrammeHandler];

const queryHandlers = [GetProgrammeByIdHandler, GetProgrammesHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ProgrammeController],
  providers: [PrismaService, ProgrammeRepository, ...commandHandlers, ...queryHandlers],
})
export class ProgrammeModule {}
