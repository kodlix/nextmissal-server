import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StorageService } from '@modules/storage/services/storage.service';
import { FileMapper } from '../file.mapper';
import { FileResponseDto } from '../file.response';
import { Paginated } from '@shared/dtos/paginated.dto';

export class GetUserFilesQuery {
  constructor(
    public readonly userId: bigint,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

@QueryHandler(GetUserFilesQuery)
export class GetUserFilesQueryHandler
  implements IQueryHandler<GetUserFilesQuery, Paginated<FileResponseDto>>
{
  constructor(
    private readonly storageService: StorageService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(query: GetUserFilesQuery): Promise<Paginated<FileResponseDto>> {
    const { userId, page, limit } = query;
    const [files, total] = await Promise.all([
      this.storageService.getFilesByUserId(userId, page, limit),
      this.storageService.countFilesByUserId(userId),
    ]);

    const fileDtos = await this.fileMapper.toResponseDtoList(files);

    return new Paginated<FileResponseDto>(fileDtos, total, page, limit);
  }
}
