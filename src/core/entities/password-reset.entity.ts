import { v4 as uuid } from 'uuid';

export class PasswordReset {
  id: string;
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;

  constructor(
    userId: string,
    email: string,
    expirationMinutes: number = 60
  ) {
    this.id = uuid();
    this.userId = userId;
    this.email = email;
    this.token = uuid();
    
    // Set expiration time (default: 60 minutes)
    const now = new Date();
    this.expiresAt = new Date(now.getTime() + expirationMinutes * 60000);
    
    this.usedAt = null;
    this.createdAt = now;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isUsed(): boolean {
    return this.usedAt !== null;
  }

  markAsUsed(): void {
    this.usedAt = new Date();
  }
}