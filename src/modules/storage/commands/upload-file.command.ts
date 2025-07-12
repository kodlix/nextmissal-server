import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StorageService, IStorageFile } from '@modules/storage/services/storage.service';
import { FileMapper } from '../file.mapper';
import { FileResponseDto } from '../file.response';

export class UploadFileCommand {
  constructor(
    public readonly file: IStorageFile,
    public readonly userId?: bigint,
  ) {}
}

@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler
  implements ICommandHandler<UploadFileCommand, FileResponseDto>
{
  constructor(
    private readonly storageService: StorageService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(command: UploadFileCommand): Promise<FileResponseDto> {
    const { file, userId } = command;

    const fileEntity = await this.storageService.uploadFile(file, userId);

    return this.fileMapper.toResponseDto(fileEntity);
  }
}
