import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsBoolean, IsInt } from 'class-validator';

export class UpdateEventDto {
  @ApiPropertyOptional({ description: 'The name of the event', example: 'Annual Harvest' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the event',
    example: 'Annual harvest and thanksgiving service',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The start date and time of the event',
    example: '2023-10-27T09:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'The end date and time of the event',
    example: '2023-10-27T17:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'The location of the event',
    example: 'Church Auditorium',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Whether the event is public', example: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'The ID of the parish associated with the event',
    example: 1,
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  parishId?: number;

  @ApiPropertyOptional({
    description: 'The ID of the denary associated with the event',
    example: 1,
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  denaryId?: number;

  @ApiPropertyOptional({
    description: 'The ID of the diocese associated with the event',
    example: 1,
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  dioceseId?: number;

  @ApiPropertyOptional({
    description: 'The ID of the society associated with the event',
    example: 1,
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  societyId?: number;
}
