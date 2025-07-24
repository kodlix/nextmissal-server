import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the post the comment belongs to',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  postId?: number;

  @ApiProperty({
    example: 1,
    description: `The ID of the parent comment if it's a reply`,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({ example: 'This is a comment.', description: 'The content of the comment' })
  @IsString()
  content: string;
}
