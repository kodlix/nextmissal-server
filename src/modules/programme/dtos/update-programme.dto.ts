import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum, IsInt } from 'class-validator';
import { ProgrammeFrequency } from '@prisma/client';

export class UpdateProgrammeDto {
  @ApiPropertyOptional({ description: 'The name of the programme', example: 'Morning Mass' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the programme',
    example: 'Daily morning mass for all parishioners',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'A hint or short note about the programme',
    example: 'Starts promptly at 6 AM',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  hint?: string;

  @ApiPropertyOptional({ description: 'Whether the programme is active', example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ description: 'The type of the programme', example: 'Liturgy' })
  @IsString()
  @IsOptional()
  programmeType?: string;

  @ApiPropertyOptional({
    description:
      'Indicates if the programme is general (not tied to a specific parish/denary/diocese/society)',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isGeneral?: boolean;

  @ApiPropertyOptional({
    description: 'The venue of the programme',
    example: 'Main Church Auditorium',
  })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiPropertyOptional({
    description: 'The start time of the programme',
    example: '2023-01-01T06:00:00Z',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  startTime?: Date;

  @ApiPropertyOptional({
    description: 'The end time of the programme',
    example: '2023-01-01T07:00:00Z',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  endTime?: Date;

  @ApiPropertyOptional({
    description: 'The frequency of the programme',
    enum: ProgrammeFrequency,
    example: ProgrammeFrequency.DAILY,
  })
  @IsEnum(ProgrammeFrequency)
  @IsOptional()
  frequency?: ProgrammeFrequency;

  @ApiPropertyOptional({
    description: 'Additional information about the frequency',
    example: 'Every Monday, Wednesday, Friday',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  frequencyInfo?: string;

  @ApiPropertyOptional({
    description: 'The ID of the parish associated with the programme',
    example: 1,
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  parishId?: number;

  @ApiPropertyOptional({
    description: 'The ID of the denary associated with the programme',
    example: 1,
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  denaryId?: number;

  @ApiPropertyOptional({
    description: 'The ID of the diocese associated with the programme',
    example: 1,
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  dioceseId?: number;

  @ApiPropertyOptional({
    description: 'The ID of the society associated with the programme',
    example: 1,
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  societyId?: number;
}
