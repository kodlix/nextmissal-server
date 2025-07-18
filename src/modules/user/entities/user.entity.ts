import { Role } from '@modules/role/entities/role.entity';
import { Email } from '@core/value-objects/email.vo';
import { FirstName, LastName } from '@core/value-objects/name.vo';

import { AggregateRoot } from '@core/events/domain-event.base';
import {
  UserRegisteredEvent,
  UserActivatedEvent,
  UserDeactivatedEvent,
  UserRoleAssignedEvent,
  UserRoleRemovedEvent,
  UserPasswordChangedEvent,
  UserEmailChangedEvent,
  UserTwoFactorEnabledEvent,
  UserTwoFactorDisabledEvent,
  UserLastLoginUpdatedEvent,
} from '@core/events/user.events';
import {
  UserNotEligibleForRoleException,
  UserAlreadyHasRoleException,
  InactiveUserException,
  UserCannotRemoveLastRoleException,
  InvalidValueObjectException,
} from '@core/exceptions/domain-exceptions';
import { CanAssignRoleSpecification } from '@modules/user/specifications/user.specifications';
import { RolesCollection } from '@core/value-objects/collections/roles.collection';

export class User extends AggregateRoot {
  private readonly _id: bigint;
  private _email: Email;
  private _passwordHash: string;
  private _username: string;
  private _firstName: FirstName;
  private _lastName: LastName;
  private _gender?: string;
  private _phoneNumber?: string;
  private _profileImage?: string;
  private _emailVerified: boolean;
  private _isFirstLogin: boolean;
  private _dateOfBirth?: Date;
  private _parishId?: number;
  private _isActive: boolean;
  private _otpEnabled: boolean;
  private _otpSecret?: string;
  private _roles: Role[];
  private _lastLoginAt?: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    email: Email,
    passwordHash: string,
    username: string,
    firstName: FirstName,
    lastName: LastName,
    gender?: string,
    phoneNumber?: string,
    profileImage?: string,
    emailVerified: boolean = false,
    isFirstLogin: boolean = true,
    dateOfBirth?: Date,
    parishId?: number,
    isActive: boolean = true,
    createdAt?: Date,
    id?: bigint,
  ) {
    super();
    this._id = id || BigInt(Math.floor(Math.random() * 1000000));
    this._email = email;
    this._passwordHash = passwordHash;
    this._username = username;
    this._firstName = firstName;
    this._lastName = lastName;
    this._gender = gender;
    this._phoneNumber = phoneNumber;
    this._profileImage = profileImage;
    this._emailVerified = emailVerified;
    this._isFirstLogin = isFirstLogin;
    this._dateOfBirth = dateOfBirth;
    this._parishId = parishId;
    this._isActive = isActive;
    this._otpEnabled = false;
    this._roles = [];
    this._createdAt = createdAt || new Date();
    this._updatedAt = new Date();
  }

  // Factory method for creating new users
  static create(
    email: Email,
    passwordHash: string,
    username: string,
    firstName: FirstName,
    lastName: LastName,
    gender?: string,
    phoneNumber?: string,
    profileImage?: string,
    emailVerified: boolean = false,
    isFirstLogin: boolean = true,
    dateOfBirth?: Date,
    parishId?: number,
  ): User {
    const user = new User(
      email,
      passwordHash,
      username,
      firstName,
      lastName,
      gender,
      phoneNumber,
      profileImage,
      emailVerified,
      isFirstLogin,
      dateOfBirth,
      parishId,
      true,
      undefined,
      BigInt(Math.floor(Math.random() * 1000000)),
    );

    user.addDomainEvent(
      new UserRegisteredEvent(user.id, email.getValue(), firstName.getValue(), lastName.getValue()),
    );

    return user;
  }

  // Factory method for reconstituting from persistence
  static fromData(data: {
    id: bigint;
    email: string;
    passwordHash: string;
    username: string;
    firstName: string;
    lastName: string;
    gender: string;
    isActive: boolean;
    otpEnabled: boolean;
    otpSecret?: string;
    lastLoginAt?: Date;
    phoneNumber?: string;
    roles: Role[];
    profileImage?: string;
    emailVerified: boolean;
    isFirstLogin: boolean;
    dateOfBirth?: Date;
    parishId?: number;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    const user = new User(
      new Email(data.email),
      data.passwordHash,
      data.username,
      new FirstName(data.firstName),
      new LastName(data.lastName),
      data.gender,
      data.phoneNumber,
      data.profileImage,
      data.emailVerified,
      data.isFirstLogin,
      data.dateOfBirth,
      data.parishId,
      data.isActive,
      data.createdAt,
      data.id,
    );

    user._otpEnabled = data.otpEnabled;
    user._otpSecret = data.otpSecret;
    user._roles = data.roles;
    user._lastLoginAt = data.lastLoginAt;
    user._updatedAt = data.updatedAt;

    return user;
  }

  // Getters
  get id(): bigint {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get firstName(): FirstName {
    return this._firstName;
  }

  get lastName(): LastName {
    return this._lastName;
  }

  get username(): string {
    return this._username;
  }

  get gender(): string | undefined {
    return this._gender;
  }

  get phoneNumber(): string | undefined {
    return this._phoneNumber;
  }

  get profileImage(): string | undefined {
    return this._profileImage;
  }

  get emailVerified(): boolean {
    return this._emailVerified;
  }

  get isFirstLogin(): boolean {
    return this._isFirstLogin;
  }

  set isFirstLogin(_firstLogin: boolean) {
    this.isFirstLogin = _firstLogin;
  }

  get dateOfBirth(): Date | undefined {
    return this._dateOfBirth;
  }

  get parishId(): number | undefined {
    return this._parishId;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get otpEnabled(): boolean {
    return this._otpEnabled;
  }

  get otpSecret(): string | undefined {
    return this._otpSecret;
  }

  get roles(): Role[] {
    return [...this._roles]; // Return copy to prevent external mutation
  }

  get rolesCollection(): RolesCollection {
    return RolesCollection.create(this._roles);
  }

  get lastLoginAt(): Date | undefined {
    return this._lastLoginAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods with proper encapsulation and rules
  activate(): void {
    if (this._isActive) {
      return; // Already active, no change needed
    }

    this._isActive = true;
    this._updatedAt = new Date();
    this.addDomainEvent(new UserActivatedEvent(this._id));
  }

  deactivate(): void {
    if (!this._isActive) {
      return; // Already inactive, no change needed
    }

    this._isActive = false;
    this._updatedAt = new Date();
    this.addDomainEvent(new UserDeactivatedEvent(this._id));
  }

  enableTwoFactor(secret: string): void {
    if (!secret || secret.trim().length === 0) {
      throw new InvalidValueObjectException('Two-factor secret cannot be empty');
    }

    if (!this._isActive) {
      throw new InactiveUserException('enable two-factor authentication');
    }

    this._otpEnabled = true;
    this._otpSecret = secret;
    this._updatedAt = new Date();
    this.addDomainEvent(new UserTwoFactorEnabledEvent(this._id));
  }

  disableTwoFactor(): void {
    if (!this._otpEnabled) {
      return; // Already disabled, no change needed
    }

    this._otpEnabled = false;
    this._otpSecret = undefined;
    this._updatedAt = new Date();
    this.addDomainEvent(new UserTwoFactorDisabledEvent(this._id));
  }

  // Aliases for backward compatibility
  enableOtp(secret: string): void {
    this.enableTwoFactor(secret);
  }

  disableOtp(): void {
    this.disableTwoFactor();
  }

  addRole(role: Role): void {
    // Use specification pattern for business rule validation
    const canAssignRoleSpec = new CanAssignRoleSpecification(role);

    if (!canAssignRoleSpec.isSatisfiedBy(this)) {
      if (!this._isActive) {
        throw new InactiveUserException('assign role');
      }
      if (this.hasRole(role.id)) {
        throw new UserAlreadyHasRoleException(this._id, role.name);
      }
      throw new UserNotEligibleForRoleException(this._id, role.name);
    }

    this._roles.push(role);
    this._updatedAt = new Date();
    this.addDomainEvent(new UserRoleAssignedEvent(this._id, role.id, role.name));
  }

  removeRole(roleId: bigint): void {
    if (!this._isActive) {
      throw new InactiveUserException('remove role');
    }

    if (this._roles.length <= 1) {
      throw new UserCannotRemoveLastRoleException();
    }

    const roleToRemove = this._roles.find(r => r.id === roleId);
    if (!roleToRemove) {
      return; // Role not found, no change needed
    }

    this._roles = this._roles.filter(r => r.id !== roleId);
    this._updatedAt = new Date();
    this.addDomainEvent(new UserRoleRemovedEvent(this._id, roleId, roleToRemove.name));
  }

  changeEmail(newEmail: Email): void {
    if (!this._isActive) {
      throw new InactiveUserException('change email');
    }

    if (this._email.equals(newEmail)) {
      return; // Same email, no change needed
    }

    const oldEmail = this._email.getValue();
    this._email = newEmail;
    this._updatedAt = new Date();
    this.addDomainEvent(new UserEmailChangedEvent(this._id, oldEmail, newEmail.getValue()));
  }

  changePassword(newPasswordHash: string): void {
    if (!newPasswordHash || newPasswordHash.trim().length === 0) {
      throw new InvalidValueObjectException('Password hash cannot be empty');
    }

    if (!this._isActive) {
      throw new InactiveUserException('change password');
    }

    this._passwordHash = newPasswordHash;
    this._updatedAt = new Date();
    this.addDomainEvent(new UserPasswordChangedEvent(this._id));
  }

  updateLastLogin(): void {
    const now = new Date();
    this._lastLoginAt = now;
    this._updatedAt = now;
    this.addDomainEvent(new UserLastLoginUpdatedEvent(this._id, now));
  }

  updateProfile(
    firstName?: FirstName,
    lastName?: LastName,
    gender?: string,
    phoneNumber?: string,
    profileImage?: string,
    dateOfBirth?: Date,
    parishId?: number,
  ): void {
    if (!this._isActive) {
      throw new InactiveUserException('update profile');
    }

    let hasChanges = false;

    if (firstName && !this._firstName.equals(firstName)) {
      this._firstName = firstName;
      hasChanges = true;
    }

    if (lastName && !this._lastName.equals(lastName)) {
      this._lastName = lastName;
      hasChanges = true;
    }

    if (gender !== undefined) {
      this._gender = gender;
      hasChanges = true;
    }

    if (phoneNumber !== undefined) {
      this._phoneNumber = phoneNumber;
      hasChanges = true;
    }

    if (profileImage !== undefined) {
      this._profileImage = profileImage;
      hasChanges = true;
    }

    if (dateOfBirth !== undefined) {
      this._dateOfBirth = dateOfBirth;
      hasChanges = true;
    }

    if (parishId !== undefined) {
      this._parishId = parishId;
      hasChanges = true;
    }

    if (hasChanges) {
      this._updatedAt = new Date();
    }
  }

  // Query methods
  hasRole(roleId: bigint): boolean {
    return this._roles.some(r => r.id === roleId);
  }

  hasPermission(permissionName: string): boolean {
    return this.rolesCollection.hasPermission(permissionName);
  }

  getFullName(): string {
    return `${this._firstName.getValue()} ${this._lastName.getValue()}`;
  }

  isEligibleForAdminRole(): boolean {
    // Business rule: Only active users with at least one role can be admins
    return this._isActive && this.rolesCollection.hasAdminPrivileges();
  }

  // Private helper methods
  private isEligibleForRole(role: Role): boolean {
    // Business rule: Only active users can be assigned roles
    if (!this._isActive) {
      return false;
    }

    // Business rule: Admin roles require special eligibility
    if (role.isAdminRole() && !this.isEligibleForAdminRole()) {
      return false;
    }

    return true;
  }
}
