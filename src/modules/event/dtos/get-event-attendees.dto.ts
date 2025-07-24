import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString, IsEnum, IsInt } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class GetEventAttendeesDto {
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
    description: 'Search term for attendee name or email',
    type: String,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort order (e.g., createdAt:desc)',
    type: String,
    example: 'createdAt:desc',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Filter by attendance status',
    enum: AttendanceStatus,
    example: AttendanceStatus.REGISTERED,
  })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  userId?: number;
}
