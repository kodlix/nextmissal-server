import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '@core/events/domain-event.base';
import { LoggerService } from '@core/logger/logger.service';

export class UserRoleAssignedEvent extends DomainEvent {
  constructor(
    public readonly userId: bigint,
    public readonly roleId: bigint,
    public readonly roleName: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'user.role.assigned';
  }
}

@Injectable()
export class UserRoleAssignedEventHandler {
  constructor(private readonly logger: LoggerService) {}

  @OnEvent('UserRoleAssignedEvent')
  async handleUserRoleAssignedEvent(event: UserRoleAssignedEvent) {
    this.logger.log({
      message: 'Role assigned to user',
      userId: event.userId,
      roleId: event.roleId,
      roleName: event.roleName,
      eventId: event.eventId,
    });
    // Here you could add additional side effects like:
    // - Invalidate permission cache
    // - Send notification to admin
    // - Update user session
  }
}
