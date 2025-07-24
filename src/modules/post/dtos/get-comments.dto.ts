import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class GetCommentsDto {
  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ example: 10, description: 'Items per page', required: false })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({
    example: 'search term',
    description: 'Search term for comment content',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: 'createdAt:desc',
    description: 'Sort order (e.g., createdAt:desc)',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({ example: 1, description: 'Filter by post ID', required: false })
  @IsOptional()
  @IsNumber()
  postId?: number;

  @ApiProperty({
    example: 1,
    description: 'Filter by parent comment ID (for replies)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
