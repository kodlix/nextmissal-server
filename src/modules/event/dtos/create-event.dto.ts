import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean, IsInt } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ description: 'The name of the event', example: 'Annual Harvest' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A detailed description of the event',
    example: 'Annual harvest and thanksgiving service',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The start date and time of the event',
    example: '2023-10-27T09:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'The end date and time of the event',
    example: '2023-10-27T17:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiPropertyOptional({
    description: 'The location of the event',
    example: 'Church Auditorium',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Whether the event is public',
    example: true,
    default: false,
  })
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
