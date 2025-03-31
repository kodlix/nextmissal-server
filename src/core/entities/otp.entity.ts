import { v4 as uuidv4 } from 'uuid';

export class Otp {
  id: string;
  userId: string;
  secret: string;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;

  constructor(userId: string, secret: string, expirationMinutes: number) {
    this.id = uuidv4();
    this.userId = userId;
    this.secret = secret;
    
    // Set expiration time
    const now = new Date();
    this.expiresAt = new Date(now.getTime() + expirationMinutes * 60000);
    this.createdAt = now;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  markAsVerified(): void {
    this.verifiedAt = new Date();
  }
}