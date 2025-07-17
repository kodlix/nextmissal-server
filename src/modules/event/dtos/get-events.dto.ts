import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumberString,
  IsBoolean,
  IsDateString,
  IsInt,
} from 'class-validator';

export class GetEventsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Search term for event name or description',
    type: String,
    example: 'Harvest',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort order (e.g., name:asc, createdAt:desc)',
    type: String,
    example: 'name:asc',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Filter by public status',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by start date (ISO 8601 format)',
    type: String,
    example: '2023-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date (ISO 8601 format)',
    type: String,
    example: '2023-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by parish ID',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  parishId?: number;

  @ApiPropertyOptional({
    description: 'Filter by denary ID',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  denaryId?: number;

  @ApiPropertyOptional({
    description: 'Filter by diocese ID',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  dioceseId?: number;

  @ApiPropertyOptional({
    description: 'Filter by society ID',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  societyId?: number;
}
