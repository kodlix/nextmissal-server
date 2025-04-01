import { v4 as uuidv4 } from 'uuid';
import { Role } from './role.entity';

export class User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  otpEnabled: boolean;
  otpSecret?: string;
  roles: Role[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
  ) {
    this.id = uuidv4();
    this.email = email;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isActive = true;
    this.otpEnabled = false;
    this.roles = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  enableOtp(secret: string): void {
    this.otpEnabled = true;
    this.otpSecret = secret;
    this.updatedAt = new Date();
  }

  disableOtp(): void {
    this.otpEnabled = false;
    this.otpSecret = null;
    this.updatedAt = new Date();
  }

  addRole(role: Role): void {
    if (!this.roles.some(r => r.id === role.id)) {
      this.roles.push(role);
      this.updatedAt = new Date();
    }
  }

  removeRole(roleId: string): void {
    this.roles = this.roles.filter(r => r.id !== roleId);
    this.updatedAt = new Date();
  }

  updateLastLogin(): void {
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
  }

  setPassword(passwordHash: string): void {
    this.passwordHash = passwordHash;
    this.updatedAt = new Date();
  }
}