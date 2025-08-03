import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { EventController } from './event.controller';
import { EventRepository } from './repositories/event.repository';
import { EventAttendeeRepository } from './repositories/event-attendee.repository';
import { CreateEventHandler } from './commands/create-event.command';
import { UpdateEventHandler } from './commands/update-event.command';
import { DeleteEventHandler } from './commands/delete-event.command';
import { RegisterEventAttendeeHandler } from './commands/register-event-attendee.command';
import { UpdateEventAttendeeHandler } from './commands/update-event-attendee.command';
import { GetEventByIdHandler } from './queries/get-event-by-id.query';
import { GetEventsHandler } from './queries/get-events.query';
import { GetEventAttendeesHandler } from './queries/get-event-attendees.query';
import { EventViewedEventHandler } from './events/event-viewed.event-handler';

const commandHandlers = [
  CreateEventHandler,
  UpdateEventHandler,
  DeleteEventHandler,
  RegisterEventAttendeeHandler,
  UpdateEventAttendeeHandler,
];

const queryHandlers = [GetEventByIdHandler, GetEventsHandler, GetEventAttendeesHandler];

const eventHandlers = [EventViewedEventHandler];

@Module({
  imports: [CqrsModule],
  controllers: [EventController],
  providers: [
    PrismaService,
    EventRepository,
    EventAttendeeRepository,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
  ],
})
export class EventModule {}
