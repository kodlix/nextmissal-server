import { v4 as uuid } from 'uuid';

export class EmailVerification {
  id: string;
  email: string;
  code: string;
  expiresAt: Date;
  verifiedAt: Date | null;
  createdAt: Date;

  constructor(
    email: string,
    code: string,
    expirationMinutes: number = 5
  ) {
    this.id = uuid();
    this.email = email;
    this.code = code;
    
    // Set expiration time (default: 5 minutes)
    const now = new Date();
    this.expiresAt = new Date(now.getTime() + expirationMinutes * 60000);
    
    this.verifiedAt = null;
    this.createdAt = now;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isVerified(): boolean {
    return this.verifiedAt !== null;
  }

  markAsVerified(): void {
    this.verifiedAt = new Date();
  }
}