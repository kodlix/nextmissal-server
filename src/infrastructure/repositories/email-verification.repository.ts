import { Injectable } from '@nestjs/common';
import { EmailVerification } from '@core/entities/email-verification.entity';
import { IEmailVerificationRepository } from '@core/repositories/email-verification.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class EmailVerificationRepository implements IEmailVerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<EmailVerification | null> {
    const record = await this.prisma.emailVerification.findUnique({
      where: { id }
    });

    return record ? this.mapToModel(record) : null;
  }

  async findByEmail(email: string): Promise<EmailVerification | null> {
    const record = await this.prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' }
    });

    return record ? this.mapToModel(record) : null;
  }

  async findByEmailAndCode(email: string, code: string): Promise<EmailVerification | null> {
    const record = await this.prisma.emailVerification.findFirst({
      where: { 
        email,
        code 
      },
      orderBy: { createdAt: 'desc' }
    });

    return record ? this.mapToModel(record) : null;
  }

  async create(emailVerification: EmailVerification): Promise<EmailVerification> {
    await this.prisma.emailVerification.create({
      data: {
        id: emailVerification.id,
        email: emailVerification.email,
        code: emailVerification.code,
        expiresAt: emailVerification.expiresAt,
        verifiedAt: emailVerification.verifiedAt,
        createdAt: emailVerification.createdAt
      }
    });

    return emailVerification;
  }

  async update(emailVerification: EmailVerification): Promise<EmailVerification> {
    await this.prisma.emailVerification.update({
      where: { id: emailVerification.id },
      data: {
        email: emailVerification.email,
        code: emailVerification.code,
        expiresAt: emailVerification.expiresAt,
        verifiedAt: emailVerification.verifiedAt
      }
    });

    return emailVerification;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.emailVerification.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByEmail(email: string): Promise<boolean> {
    try {
      await this.prisma.emailVerification.deleteMany({
        where: { email }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToModel(record: any): EmailVerification {
    const verification = new EmailVerification(
      record.email,
      record.code,
      0 // We don't need to specify expiration here as we're loading from DB
    );
    
    verification.id = record.id;
    verification.expiresAt = record.expiresAt;
    verification.verifiedAt = record.verifiedAt;
    verification.createdAt = record.createdAt;
    
    return verification;
  }
}
