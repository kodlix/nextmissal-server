import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StorageController } from './storage.controller';
import { StorageModule as InfrastructureStorageModule } from '@core/storage/storage.module';

// Commands
import { UploadFileCommandHandler } from '@modules/storage/commands/upload-file.command';
import { DeleteFileCommandHandler } from '@modules/storage/commands/delete-file.command';
import { UpdateFileAccessCommandHandler } from '@modules/storage/commands/update-file-access.command';

// Queries
import { GetFileQueryHandler } from '@modules/storage/queries/get-file.query';
import { GetUserFilesQueryHandler } from '@modules/storage/queries/get-user-files.query';

// Mappers
import { FileMapper } from '@modules/storage/file.mapper';

const CommandHandlers = [
  UploadFileCommandHandler,
  DeleteFileCommandHandler,
  UpdateFileAccessCommandHandler,
];

const QueryHandlers = [GetFileQueryHandler, GetUserFilesQueryHandler];

@Global()
@Module({
  imports: [CqrsModule, InfrastructureStorageModule],
  controllers: [StorageController],
  providers: [...CommandHandlers, ...QueryHandlers, FileMapper],
})
export class StorageModule {}
