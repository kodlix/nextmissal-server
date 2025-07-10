import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { UploadFileCommand } from 'src/modules/storage/commands/upload-file.command';
import { DeleteFileCommand } from 'src/modules/storage/commands/delete-file.command';
import { UpdateFileAccessCommand } from 'src/modules/storage/commands/update-file-access.command';
import { GetFileQuery } from '@modules/storage/queries/get-file.query';
import { GetUserFilesQuery } from '@modules/storage/queries/get-user-files.query';

import { UpdateFileAccessDto } from '@modules/storage/dtos/update-file-access.dto';
import { FileResponseDto } from 'src/modules/storage/file.response';
import { IJwtPayload } from 'src/modules/user/user.response';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('upload')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /(jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: IJwtPayload,
  ): Promise<FileResponseDto> {
    const storageFile = {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    return this.commandBus.execute(new UploadFileCommand(storageFile, user.sub));
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  async getFile(
    @Param('id') id: string,
    @CurrentUser() user: IJwtPayload,
  ): Promise<FileResponseDto> {
    return this.queryBus.execute(new GetFileQuery(id, user.sub));
  }

  @Get('user/files')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all files for the current user' })
  async getUserFiles(@CurrentUser() user: IJwtPayload): Promise<FileResponseDto[]> {
    return this.queryBus.execute(new GetUserFilesQuery(user.sub));
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  async deleteFile(@Param('id') id: string, @CurrentUser() user: IJwtPayload): Promise<void> {
    return this.commandBus.execute(new DeleteFileCommand(id, user.sub));
  }

  @Patch('access')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update file access (public/private)' })
  async updateFileAccess(
    @Body() updateFileAccessDto: UpdateFileAccessDto,
    @CurrentUser() user: IJwtPayload,
  ): Promise<FileResponseDto> {
    return this.commandBus.execute(
      new UpdateFileAccessCommand(
        updateFileAccessDto.fileId,
        updateFileAccessDto.isPublic,
        user.sub,
      ),
    );
  }
}
