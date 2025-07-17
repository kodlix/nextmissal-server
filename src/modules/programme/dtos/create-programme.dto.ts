import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ProgrammeFrequency } from '@prisma/client';

export class CreateProgrammeDto {
  @ApiProperty({ description: 'The name of the programme', example: 'Morning Mass' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A detailed description of the programme',
    example: 'Daily morning mass for all parishioners',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'A hint or short note about the programme',
    example: 'Starts promptly at 6 AM',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  hint?: string;

  @ApiPropertyOptional({
    description: 'Whether the programme is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ description: 'The type of the programme', example: 'Liturgy' })
  @IsString()
  @IsNotEmpty()
  programmeType: string;

  @ApiPropertyOptional({
    description:
      'Indicates if the programme is general (not tied to a specific parish/denary/diocese/society)',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isGeneral?: boolean;

  @ApiPropertyOptional({
    description: 'The venue of the programme',
    example: 'Main Church Auditorium',
    default: 'Church Premise',
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

  @ApiProperty({
    description: 'The frequency of the programme',
    enum: ProgrammeFrequency,
    example: ProgrammeFrequency.DAILY,
  })
  @IsEnum(ProgrammeFrequency)
  @IsNotEmpty()
  frequency: ProgrammeFrequency;

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
