import { v4 as uuidv4 } from 'uuid';

export class RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;

  constructor(userId: string, token: string, expirationDays: number) {
    this.id = uuidv4();
    this.userId = userId;
    this.token = token;
    
    // Set expiration time
    const now = new Date();
    this.expiresAt = new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    this.createdAt = now;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isRevoked(): boolean {
    return !!this.revokedAt;
  }

  revoke(): void {
    this.revokedAt = new Date();
  }
}