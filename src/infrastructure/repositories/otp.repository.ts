import { Injectable } from '@nestjs/common';
import { Otp } from '@core/entities/otp.entity';
import { IOtpRepository } from '@core/repositories/otp.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Otp as PrismaOtp } from '@prisma/client';

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async findById(id: string): Promise<Otp | null> {
    const otpRecord = await this.prisma.otp.findUnique({
      where: { id },
    });

    if (!otpRecord) {
      return null;
    }

    return this.mapToModel(otpRecord as unknown as PrismaOtp);
  }

  async findByUserId(userId: string): Promise<Otp | null> {
    const otpRecord = await this.prisma.otp.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return null;
    }

    return this.mapToModel(otpRecord as unknown as PrismaOtp);
  }

  async create(otp: Otp): Promise<Otp> {
    const createdOtp = await this.prisma.otp.create({
      data: {
        id: otp.id,
        userId: otp.userId,
        secret: otp.secret,
        expiresAt: otp.expiresAt,
        verifiedAt: otp.verifiedAt,
        createdAt: otp.createdAt,
      },
    });

    return this.mapToModel(createdOtp as unknown as PrismaOtp);
  }

  async update(otp: Otp): Promise<Otp> {
    const updatedOtp = await this.prisma.otp.update({
      where: { id: otp.id },
      data: {
        secret: otp.secret,
        expiresAt: otp.expiresAt,
        verifiedAt: otp.verifiedAt,
      },
    });

    return this.mapToModel(updatedOtp as unknown as PrismaOtp);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.otp.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToModel(record: PrismaOtp): Otp {
    const expirationMinutes = this.configService.get<number>('OTP_EXPIRATION', 5);
    const otp = new Otp(record.userId, record.secret, expirationMinutes);
    
    otp.id = record.id;
    otp.expiresAt = record.expiresAt;
    otp.verifiedAt = record.verifiedAt || undefined;
    otp.createdAt = record.createdAt;
    
    return otp;
  }
}