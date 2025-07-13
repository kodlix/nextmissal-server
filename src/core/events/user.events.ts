import { DomainEvent } from './domain-event.base';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: bigint,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'user.registered';
  }
}

export class UserActivatedEvent extends DomainEvent {
  constructor(public readonly userId: bigint) {
    super();
  }

  getEventName(): string {
    return 'user.activated';
  }
}

export class UserDeactivatedEvent extends DomainEvent {
  constructor(public readonly userId: bigint) {
    super();
  }

  getEventName(): string {
    return 'user.deactivated';
  }
}

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

export class UserTwoFactorEnabledEvent extends DomainEvent {
  constructor(public readonly userId: bigint) {
    super();
  }

  getEventName(): string {
    return 'user.two_factor.enabled';
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
