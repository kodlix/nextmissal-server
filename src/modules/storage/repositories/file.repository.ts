import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { IFileRepository } from '@modules/storage/repositories/file.repository.interface';
import { File } from '@modules/storage/entities/file.entity';
import { BaseRepository } from '@core/repositories/base.repository';

/**
 * Interface representing file data from storage
 */
export interface IFileData {
  id: bigint;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  bucket: string;
  userId: bigint;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class FileRepository extends BaseRepository<File> implements IFileRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: bigint): Promise<File | null> {
    const fileData = await this.prisma.file.findUnique({
      where: { id },
    });

    return fileData ? this.mapToEntity(fileData) : null;
  }

  async findByUserId(userId: bigint, page: number, limit: number): Promise<File[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const files = await this.prisma.file.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return files.map(file => this.mapToEntity(file));
  }

  async countByUserId(userId: bigint): Promise<number> {
    return this.prisma.file.count({
      where: { userId },
    });
  }

  async findByPath(path: string): Promise<File | null> {
    const fileData = await this.prisma.file.findFirst({
      where: { path },
    });

    return fileData ? this.mapToEntity(fileData) : null;
  }

  async save(file: File): Promise<File> {
    const fileData = await this.prisma.file.create({
      data: {
        id: file.id,
        filename: file.filename,
        originalName: file.originalName,
        path: file.path,
        mimeType: file.mimeType,
        size: file.size,
        bucket: file.bucket,
        userId: file.userId,
        isPublic: file.isPublic,
      },
    });

    return this.mapToEntity(fileData);
  }

  async update(file: File): Promise<File> {
    const fileData = await this.prisma.file.update({
      where: { id: file.id },
      data: {
        isPublic: file.isPublic,
        updatedAt: file.updatedAt,
      },
    });

    return this.mapToEntity(fileData);
  }

  async delete(id: bigint): Promise<void> {
    await this.prisma.file.delete({
      where: { id },
    });
  }

  private mapToEntity(fileData: IFileData): File {
    return new File(
      fileData.filename,
      fileData.originalName,
      fileData.path,
      fileData.mimeType,
      fileData.size,
      fileData.bucket,
      fileData.userId,
      fileData.isPublic,
      fileData.id,
    );
  }
}
