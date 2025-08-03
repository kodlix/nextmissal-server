import { DomainEvent } from './domain-event.base';

export class UserDeactivatedEvent extends DomainEvent {
  constructor(public readonly userId: bigint) {
    super();
  }

  getEventName(): string {
    return 'user.deactivated';
  }
}

export class UserRoleRemovedEvent extends DomainEvent {
  constructor(
    public readonly userId: bigint,
    public readonly roleId: bigint,
    public readonly roleName: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'user.role.removed';
  }
}

export class UserPasswordChangedEvent extends DomainEvent {
  constructor(public readonly userId: bigint) {
    super();
  }

  getEventName(): string {
    return 'user.password.changed';
  }
}

export class UserEmailChangedEvent extends DomainEvent {
  constructor(
    public readonly userId: bigint,
    public readonly oldEmail: string,
    public readonly newEmail: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'user.email.changed';
  }
}

export class UserTwoFactorDisabledEvent extends DomainEvent {
  constructor(public readonly userId: bigint) {
    super();
  }

  getEventName(): string {
    return 'user.two_factor.disabled';
  }
}

export class UserLastLoginUpdatedEvent extends DomainEvent {
  constructor(
    public readonly userId: bigint,
    public readonly loginTime: Date,
  ) {
    super();
  }

  getEventName(): string {
    return 'user.last_login.updated';
  }
}
