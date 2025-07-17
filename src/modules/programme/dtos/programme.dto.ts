import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Programme, ProgrammeFrequency } from '@prisma/client';

export class ProgrammeDto implements Programme {
  @ApiProperty({ description: 'The unique identifier of the programme', example: 1 })
  id: number;

  @ApiProperty({ description: 'The name of the programme', example: 'Morning Mass' })
  name: string;

  @ApiProperty({
    description: 'A detailed description of the programme',
    example: 'Daily morning mass for all parishioners',
  })
  description: string;

  @ApiPropertyOptional({
    description: 'A hint or short note about the programme',
    example: 'Starts promptly at 6 AM',
    nullable: true,
  })
  hint: string | null;

  @ApiProperty({ description: 'Whether the programme is active', example: true })
  active: boolean;

  @ApiProperty({ description: 'The type of the programme', example: 'Liturgy' })
  programmeType: string;

  @ApiProperty({
    description:
      'Indicates if the programme is general (not tied to a specific parish/denary/diocese/society)',
    example: false,
  })
  isGeneral: boolean;

  @ApiProperty({ description: 'The venue of the programme', example: 'Main Church Auditorium' })
  venue: string;

  @ApiPropertyOptional({
    description: 'The start time of the programme',
    example: '2023-01-01T06:00:00Z',
    nullable: true,
  })
  startTime: Date | null;

  @ApiPropertyOptional({
    description: 'The end time of the programme',
    example: '2023-01-01T07:00:00Z',
    nullable: true,
  })
  endTime: Date | null;

  @ApiProperty({
    description: 'The frequency of the programme',
    enum: ProgrammeFrequency,
    example: ProgrammeFrequency.DAILY,
  })
  frequency: ProgrammeFrequency;

  @ApiPropertyOptional({
    description: 'Additional information about the frequency',
    example: 'Every Monday, Wednesday, Friday',
    nullable: true,
  })
  frequencyInfo: string | null;

  @ApiPropertyOptional({
    description: 'The ID of the parish associated with the programme',
    example: 1,
    nullable: true,
  })
  parishId: number | null;

  @ApiPropertyOptional({
    description: 'The ID of the denary associated with the programme',
    example: 1,
    nullable: true,
  })
  denaryId: number | null;

  @ApiPropertyOptional({
    description: 'The ID of the diocese associated with the programme',
    example: 1,
    nullable: true,
  })
  dioceseId: number | null;

  @ApiPropertyOptional({
    description: 'The ID of the society associated with the programme',
    example: 1,
    nullable: true,
  })
  societyId: number | null;

  @ApiProperty({
    description: 'The date and time when the programme was created',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the programme was last updated',
    example: '2023-01-01T12:00:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'The ID of the user who created the programme',
    example: 1,
    nullable: true,
  })
  createdBy: number | null;

  @ApiPropertyOptional({
    description: 'The ID of the user who last updated the programme',
    example: 1,
    nullable: true,
  })
  updatedBy: number | null;
}
