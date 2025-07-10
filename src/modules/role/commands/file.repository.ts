import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma/prisma.service';
import { IFileRepository } from 'src/modules/storage/repositories/file.repository.interface';
import { File } from 'src/modules/storage/entities/file.entity';
import { BaseRepository } from '../../../core/repositories/base.repository';

/**
 * Interface representing file data from storage
 */
export interface IFileData {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  bucket: string;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class FileRepository extends BaseRepository<File> implements IFileRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<File | null> {
    const fileData = await this.prisma.file.findUnique({
      where: { id },
    });

    return fileData ? this.mapToEntity(fileData) : null;
  }

  async findByUserId(userId: string): Promise<File[]> {
    const files = await this.prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return files.map(file => this.mapToEntity(file));
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

  async delete(id: string): Promise<void> {
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
