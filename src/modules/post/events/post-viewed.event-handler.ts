import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { DomainEvent } from '@core/events/domain-event.base';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

export class PostViewedEvent extends DomainEvent {
  constructor(
    public readonly contentId: number,
    public readonly userId?: bigint,
    public readonly ipAddress?: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'PostViewedEvent';
  }
}

@Injectable()
@EventsHandler(PostViewedEvent)
export class PostViewedEventHandler implements IEventHandler<PostViewedEvent> {
  constructor(private prisma: PrismaService) {}

  @OnEvent('PostViewedEvent')
  async handle(event: PostViewedEvent) {
    const { contentId, userId, ipAddress } = event;

    const whereClause: { postId: number; userId?: bigint; ipAddress?: string } = {
      postId: contentId,
    };
    if (userId) {
      whereClause.userId = userId;
    } else if (ipAddress) {
      whereClause.ipAddress = ipAddress;
    }

    const existingView = await this.prisma.postView.findFirst({
      where: whereClause,
    });

    if (!existingView) {
      await this.prisma.postView.create({
        data: {
          postId: contentId,
          userId,
          ipAddress,
        },
      });

      await this.prisma.post.update({
        where: { id: contentId },
        data: {
          views: { increment: 1 },
        },
      });
    } else {
      await this.prisma.postView.update({
        where: { id: existingView.id },
        data: {
          lastViewedAt: new Date(),
        },
      });
    }
  }
}
