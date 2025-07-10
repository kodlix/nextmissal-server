import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileResponseDto } from './file.response';
import { File } from '@modules/storage/entities/file.entity';
import { StorageService } from '@modules/storage/services/storage.service';

@Injectable()
export class FileMapper {
  constructor(
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  async toResponseDto(file: File): Promise<FileResponseDto> {
    let url: string;

    if (file.isPublic) {
      url = `${this.configService.get<string>('storage.publicUrl')}/public/${file.path}`;
    } else {
      const fileUrl = await this.storageService.getFileUrl(file.id);
      url = fileUrl || '';
    }

    return new FileResponseDto({
      id: file.id,
      filename: file.filename,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      isPublic: file.isPublic,
      url,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    });
  }

  async toResponseDtoList(files: File[]): Promise<FileResponseDto[]> {
    const dtos: FileResponseDto[] = [];
    for (const file of files) {
      dtos.push(await this.toResponseDto(file));
    }

    return dtos;
  }
}
