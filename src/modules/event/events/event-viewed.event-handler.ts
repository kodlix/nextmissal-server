import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { DomainEvent } from '@core/events/domain-event.base';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

export class EventViewedEvent extends DomainEvent {
  constructor(
    public readonly contentId: number,
    public readonly userId?: bigint,
    public readonly ipAddress?: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'EventViewedEvent';
  }
}

@Injectable()
@EventsHandler(EventViewedEvent)
export class EventViewedEventHandler implements IEventHandler<EventViewedEvent> {
  constructor(private prisma: PrismaService) {}

  @OnEvent('EventViewedEvent')
  async handle(event: EventViewedEvent) {
    const { contentId, userId, ipAddress } = event;

    const whereClause: { eventId: number; userId?: bigint; ipAddress?: string } = {
      eventId: contentId,
    };
    if (userId) {
      whereClause.userId = userId;
    } else if (ipAddress) {
      whereClause.ipAddress = ipAddress;
    }

    const existingView = await this.prisma.eventView.findFirst({
      where: whereClause,
    });

    if (!existingView) {
      await this.prisma.eventView.create({
        data: {
          eventId: contentId,
          userId,
          ipAddress,
        },
      });

      await this.prisma.event.update({
        where: { id: contentId },
        data: {
          views: { increment: 1 },
        },
      });
    } else {
      await this.prisma.eventView.update({
        where: { id: existingView.id },
        data: {
          lastViewedAt: new Date(),
        },
      });
    }
  }
}
