import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { EventController } from './event.controller';
import { EventRepository } from './repositories/event.repository';
import { CreateEventHandler } from './commands/create-event.command';
import { UpdateEventHandler } from './commands/update-event.command';
import { DeleteEventHandler } from './commands/delete-event.command';
import { GetEventByIdHandler } from './queries/get-event-by-id.query';
import { GetEventsHandler } from './queries/get-events.query';

const commandHandlers = [CreateEventHandler, UpdateEventHandler, DeleteEventHandler];

const queryHandlers = [GetEventByIdHandler, GetEventsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [EventController],
  providers: [PrismaService, EventRepository, ...commandHandlers, ...queryHandlers],
})
export class EventModule {}
