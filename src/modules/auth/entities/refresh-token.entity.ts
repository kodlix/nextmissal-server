import { v4 as uuidv4 } from 'uuid';

import { Token } from '@core/value-objects/token.vo';

export class RefreshToken {
  id: bigint;
  userId: bigint;
  token: Token;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;

  constructor(userId: bigint, token: Token, expirationDays: number, id?: bigint) {
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
