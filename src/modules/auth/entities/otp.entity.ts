import { v4 as uuidv4 } from 'uuid';


export class Otp {
  id: bigint;
  userId: bigint;
  secret: string;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;

  constructor(userId: bigint, secret: string, expirationMinutes: number, id?: bigint) {
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
