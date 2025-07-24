import { ApiProperty } from '@nestjs/swagger';
import { Post, Privacy, Priority } from '@prisma/client';
import { CommentDto } from './comment.dto';

export class PostDto implements Post {
  @ApiProperty({ example: 1, description: 'The unique identifier of the post' })
  id: number;

  @ApiProperty({ example: 'My first post', description: 'The title of the post' })
  title: string;

  @ApiProperty({
    example: 'This is the content of my first post.',
    description: 'The content of the post',
  })
  content: string;

  @ApiProperty({ example: ['url1', 'url2'], description: 'Array of media URLs' })
  media: string[];

  @ApiProperty({ example: 1, description: 'The ID of the author' })
  authorId: bigint;

  @ApiProperty({ example: false, description: 'Whether the post is deleted' })
  isDeleted: boolean;

  @ApiProperty({
    example: Privacy.PUBLIC,
    description: 'Privacy setting of the post',
    enum: Privacy,
  })
  privacy: Privacy;

  @ApiProperty({ example: '#nestjs #prisma', description: 'Hashtags in the post' })
  hashtags: string;

  @ApiProperty({ example: '@user1 @user2', description: 'Mentions in the post' })
  mentions: string;

  @ApiProperty({ example: false, description: 'Whether the post is an announcement' })
  isAnnouncement: boolean;

  @ApiProperty({
    example: Priority.NORMAL,
    description: 'Priority of the announcement',
    enum: Priority,
  })
  priority: Priority;

  @ApiProperty({ example: false, description: 'Whether the post is pinned' })
  isPinned: boolean;

  @ApiProperty({ example: 'url1,url2', description: 'URLs of attachments' })
  attachments: string;

  @ApiProperty({ example: '2025-01-01T00:00:00Z', description: 'Start date for scheduled posts' })
  startsAt: Date;

  @ApiProperty({ example: '2025-12-31T23:59:59Z', description: 'Expiration date for posts' })
  expiresAt: Date;

  @ApiProperty({ example: '2024-07-24T12:00:00Z', description: 'The creation date of the post' })
  createdAt: Date;

  @ApiProperty({ example: '2024-07-24T12:00:00Z', description: 'The last update date of the post' })
  updatedAt: Date;

  @ApiProperty({ type: [CommentDto], description: 'Comments on the post', required: false })
  comments?: CommentDto[];
}
