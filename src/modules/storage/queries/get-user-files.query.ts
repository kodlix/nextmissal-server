import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StorageService } from 'src/modules/storage/services/storage.service';
import { FileMapper } from '../file.mapper';
import { FileResponseDto } from '../file.response';

export class GetUserFilesQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserFilesQuery)
export class GetUserFilesQueryHandler
  implements IQueryHandler<GetUserFilesQuery, FileResponseDto[]>
{
  constructor(
    private readonly storageService: StorageService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(query: GetUserFilesQuery): Promise<FileResponseDto[]> {
    const { userId } = query;
    const files = await this.storageService.getFilesByUserId(userId);

    return this.fileMapper.toResponseDtoList(files);
  }
}
