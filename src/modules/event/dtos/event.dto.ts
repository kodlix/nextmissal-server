import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums, Event } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class EventDto implements Event {
  @ApiProperty({ description: 'The type of the event', example: $Enums.EventType.OTHER })
  type: $Enums.EventType;

  @ApiProperty({ description: 'Indicates if the event is paid', example: false })
  isPaid: boolean;

  @ApiPropertyOptional({
    description: 'Online link for the event',
    example: 'https://zoom.us/j/123456789',
    nullable: true,
  })
  onlineLink: string;

  @ApiPropertyOptional({
    description: 'Cover image URL',
    example: 'https://example.com/image.jpg',
    nullable: true,
  })
  coverImage: string;

  @ApiPropertyOptional({
    description: 'Tags for the event',
    example: 'harvest,thanksgiving',
    nullable: true,
  })
  tags: string;

  @ApiPropertyOptional({ description: 'Maximum number of attendees', example: 100, nullable: true })
  maxAttendees: number;

  @ApiPropertyOptional({ description: 'Price of the event', example: '20.00', nullable: true })
  price: Decimal;

  @ApiProperty({ description: 'Status of the event', example: $Enums.EventStatus.UPCOMING })
  status: $Enums.EventStatus;

  @ApiProperty({ description: 'The unique identifier of the event', example: 1 })
  id: number;

  @ApiProperty({ description: 'The name of the event', example: 'Annual Harvest' })
  name: string;

  @ApiProperty({
    description: 'A detailed description of the event',
    example: 'Annual harvest and thanksgiving service',
  })
  description: string;

  @ApiProperty({
    description: 'The start date and time of the event',
    example: '2023-10-27T09:00:00Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'The end date and time of the event',
    example: '2023-10-27T17:00:00Z',
  })
  endDate: Date;

  @ApiPropertyOptional({
    description: 'The location of the event',
    example: 'Church Auditorium',
    nullable: true,
  })
  location: string | null;

  @ApiProperty({ description: 'Whether the event is public', example: true })
  isPublic: boolean | null;

  @ApiPropertyOptional({
    description: 'The ID of the parish associated with the event',
    example: 1,
    nullable: true,
  })
  parishId: number | null;

  @ApiPropertyOptional({
    description: 'The ID of the denary associated with the event',
    example: 1,
    nullable: true,
  })
  denaryId: number | null;

  @ApiPropertyOptional({
    description: 'The ID of the diocese associated with the event',
    example: 1,
    nullable: true,
  })
  dioceseId: number | null;

  @ApiPropertyOptional({
    description: 'The ID of the society associated with the event',
    example: 1,
    nullable: true,
  })
  societyId: number | null;

  @ApiProperty({
    description: 'The date and time when the event was created',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the event was last updated',
    example: '2023-01-01T12:00:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'The ID of the user who created the event',
    example: 1,
    nullable: true,
  })
  createdBy: number | null;

  @ApiPropertyOptional({
    description: 'The ID of the user who last updated the event',
    example: 1,
    nullable: true,
  })
  updatedBy: number | null;
}
