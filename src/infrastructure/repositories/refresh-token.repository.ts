import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@core/entities/refresh-token.entity';
import { IRefreshTokenRepository } from '@core/repositories/refresh-token.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { RefreshToken as PrismaRefreshToken } from '@prisma/client';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async findById(id: string): Promise<RefreshToken | null> {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { id },
    });

    if (!tokenRecord) {
      return null;
    }

    return this.mapToModel(tokenRecord as unknown as PrismaRefreshToken);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: { token },
    });

    if (!tokenRecord) {
      return null;
    }

    return this.mapToModel(tokenRecord as unknown as PrismaRefreshToken);
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const tokenRecords = await this.prisma.refreshToken.findMany({
      where: { userId },
    });

    return tokenRecords.map(record => this.mapToModel(record as unknown as PrismaRefreshToken));
  }

  async create(token: RefreshToken): Promise<RefreshToken> {
    const createdToken = await this.prisma.refreshToken.create({
      data: {
        id: token.id,
        userId: token.userId,
        token: token.token,
        expiresAt: token.expiresAt,
        revokedAt: token.revokedAt,
        createdAt: token.createdAt,
      },
    });

    return this.mapToModel(createdToken as unknown as PrismaRefreshToken);
  }

  async update(token: RefreshToken): Promise<RefreshToken> {
    const updatedToken = await this.prisma.refreshToken.update({
      where: { id: token.id },
      data: {
        token: token.token,
        expiresAt: token.expiresAt,
        revokedAt: token.revokedAt,
      },
    });

    return this.mapToModel(updatedToken as unknown as PrismaRefreshToken);
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    try {
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteExpired(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  private mapToModel(record: PrismaRefreshToken): RefreshToken {
    const refreshExpiration = parseInt(this.configService.get('JWT_REFRESH_EXPIRATION', '7').replace('d', ''), 10);
    const token = new RefreshToken(record.userId, record.token, refreshExpiration);
    
    token.id = record.id;
    token.expiresAt = record.expiresAt;
    token.revokedAt = record.revokedAt || undefined;
    token.createdAt = record.createdAt;
    
    return token;
  }
}