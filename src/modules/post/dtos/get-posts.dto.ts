import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class GetPostsDto {
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
    description: 'Search term for post title or content',
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
}
