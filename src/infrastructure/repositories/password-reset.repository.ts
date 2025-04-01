import { Injectable } from '@nestjs/common';
import { PasswordReset } from '@core/entities/password-reset.entity';
import { IPasswordResetRepository } from '@core/repositories/password-reset.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class PasswordResetRepository implements IPasswordResetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PasswordReset | null> {
    const record = await this.prisma.passwordReset.findUnique({
      where: { id }
    });

    return record ? this.mapToModel(record) : null;
  }

  async findByUserId(userId: string): Promise<PasswordReset | null> {
    const record = await this.prisma.passwordReset.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return record ? this.mapToModel(record) : null;
  }

  async findByToken(token: string): Promise<PasswordReset | null> {
    const record = await this.prisma.passwordReset.findUnique({
      where: { token }
    });

    return record ? this.mapToModel(record) : null;
  }

  async findByEmail(email: string): Promise<PasswordReset | null> {
    const record = await this.prisma.passwordReset.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' }
    });

    return record ? this.mapToModel(record) : null;
  }

  async create(passwordReset: PasswordReset): Promise<PasswordReset> {
    await this.prisma.passwordReset.create({
      data: {
        id: passwordReset.id,
        userId: passwordReset.userId,
        email: passwordReset.email,
        token: passwordReset.token,
        expiresAt: passwordReset.expiresAt,
        usedAt: passwordReset.usedAt,
        createdAt: passwordReset.createdAt
      }
    });

    return passwordReset;
  }

  async update(passwordReset: PasswordReset): Promise<PasswordReset> {
    await this.prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: {
        userId: passwordReset.userId,
        email: passwordReset.email,
        token: passwordReset.token,
        expiresAt: passwordReset.expiresAt,
        usedAt: passwordReset.usedAt
      }
    });

    return passwordReset;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.passwordReset.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    try {
      await this.prisma.passwordReset.deleteMany({
        where: { userId }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByEmail(email: string): Promise<boolean> {
    try {
      await this.prisma.passwordReset.deleteMany({
        where: { email }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToModel(record: any): PasswordReset {
    const passwordReset = new PasswordReset(
      record.userId,
      record.email,
      0 // We don't need to specify expiration here as we're loading from DB
    );
    
    passwordReset.id = record.id;
    passwordReset.token = record.token;
    passwordReset.expiresAt = record.expiresAt;
    passwordReset.usedAt = record.usedAt;
    passwordReset.createdAt = record.createdAt;
    
    return passwordReset;
  }
}