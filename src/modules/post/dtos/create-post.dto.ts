import { IsOptional, IsString, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Privacy, Priority } from '@prisma/client';

export class CreatePostDto {
  @ApiProperty({ example: 'My first post', description: 'The title of the post' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is the content of my first post.',
    description: 'The content of the post',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: ['url1', 'url2'], description: 'Array of media URLs', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  media?: string[];

  @ApiProperty({ example: false, description: 'Whether the post is deleted', required: false })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiProperty({
    example: Privacy.PUBLIC,
    description: 'Privacy setting of the post',
    enum: Privacy,
    required: false,
  })
  @IsOptional()
  @IsString()
  privacy?: Privacy;

  @ApiProperty({ example: '#nestjs #prisma', description: 'Hashtags in the post', required: false })
  @IsOptional()
  @IsString()
  hashtags?: string;

  @ApiProperty({ example: '@user1 @user2', description: 'Mentions in the post', required: false })
  @IsOptional()
  @IsString()
  mentions?: string;

  @ApiProperty({
    example: false,
    description: 'Whether the post is an announcement',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnnouncement?: boolean;

  @ApiProperty({
    example: Priority.NORMAL,
    description: 'Priority of the announcement',
    enum: Priority,
    required: false,
  })
  @IsOptional()
  @IsString()
  priority?: Priority;

  @ApiProperty({ example: false, description: 'Whether the post is pinned', required: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiProperty({ example: 'url1,url2', description: 'URLs of attachments', required: false })
  @IsOptional()
  @IsString()
  attachments?: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00Z',
    description: 'Start date for scheduled posts',
    required: false,
  })
  @IsOptional()
  @IsString()
  startsAt?: Date;

  @ApiProperty({
    example: '2025-12-31T23:59:59Z',
    description: 'Expiration date for posts',
    required: false,
  })
  @IsOptional()
  @IsString()
  expiresAt?: Date;
}
