import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString, IsBoolean, IsEnum, IsInt } from 'class-validator';
import { ProgrammeFrequency } from '@prisma/client';

export class GetProgrammesDto {
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
    description: 'Search term for programme name or description',
    type: String,
    example: 'Mass',
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
    description: 'Filter by active status',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by programme type',
    type: String,
    example: 'Liturgy',
  })
  @IsOptional()
  @IsString()
  programmeType?: string;

  @ApiPropertyOptional({
    description: 'Filter by general status',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isGeneral?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by frequency',
    enum: ProgrammeFrequency,
    example: ProgrammeFrequency.DAILY,
  })
  @IsOptional()
  @IsEnum(ProgrammeFrequency)
  frequency?: ProgrammeFrequency;

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
