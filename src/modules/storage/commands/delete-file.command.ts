import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { StorageService } from '@modules/storage/services/storage.service';

export class DeleteFileCommand {
  constructor(
    public readonly fileId: string,
    public readonly userId?: string,
  ) {}
}

@CommandHandler(DeleteFileCommand)
export class DeleteFileCommandHandler implements ICommandHandler<DeleteFileCommand, void> {
  constructor(private readonly storageService: StorageService) {}

  async execute(command: DeleteFileCommand): Promise<void> {
    const { fileId, userId } = command;

    const file = await this.storageService.getFileById(fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if the user has permission to delete the file
    if (userId && file.userId && file.userId !== userId) {
      throw new UnauthorizedException('You do not have permission to delete this file');
    }

    await this.storageService.deleteFile(fileId);
  }
}
