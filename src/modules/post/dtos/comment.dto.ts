import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@prisma/client';
import { UserDto } from '../../user/dtos/user.dto';

export class CommentDto implements Comment {
  @ApiProperty({ example: 1, description: 'The unique identifier of the comment' })
  id: number;

  @ApiProperty({ example: 1, description: 'The ID of the author' })
  authorId: bigint;

  @ApiProperty({ example: 1, description: 'The ID of the post the comment belongs to' })
  postId: number;

  @ApiProperty({
    example: 1,
    description: `The ID of the parent comment if it's a reply`,
    required: false,
  })
  parentId: number | null;

  @ApiProperty({ example: 'This is a comment.', description: 'The content of the comment' })
  content: string;

  @ApiProperty({ type: UserDto, description: 'The author of the comment' })
  author?: UserDto;

  @ApiProperty({
    type: () => [CommentDto],
    description: 'Replies to this comment',
    required: false,
  })
  replies?: CommentDto[];

  @ApiProperty({ example: '2024-07-24T12:00:00Z', description: 'The creation date of the comment' })
  @ApiProperty({ example: 0, description: 'The number of likes for the comment' })
  likesCount: number;

  createdAt: Date;
}
