import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { StorageService } from 'src/modules/storage/services/storage.service';
import { FileMapper } from '../file.mapper';
import { FileResponseDto } from '../file.response';

export class GetFileQuery {
  constructor(
    public readonly fileId: string,
    public readonly userId?: string,
  ) {}
}

@QueryHandler(GetFileQuery)
export class GetFileQueryHandler implements IQueryHandler<GetFileQuery, FileResponseDto> {
  constructor(
    private readonly storageService: StorageService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(query: GetFileQuery): Promise<FileResponseDto> {
    const { fileId, userId } = query;

    const file = await this.storageService.getFileById(fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if the user has permission to access a private file
    if (!file.isPublic && userId && file.userId && file.userId !== userId) {
      throw new UnauthorizedException('You do not have permission to access this file');
    }

    return this.fileMapper.toResponseDto(file);
  }
}
