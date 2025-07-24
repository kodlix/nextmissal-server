import { ApiProperty } from '@nestjs/swagger';
import { EventAttendee, AttendanceStatus } from '@prisma/client';

export class EventAttendeeDto implements EventAttendee {
  @ApiProperty({ description: 'The unique identifier of the event attendee record', example: 1 })
  Id: number;

  @ApiProperty({ description: 'The ID of the user attending the event', example: 1 })
  userId: bigint;

  @ApiProperty({ description: 'The ID of the event being attended', example: 1 })
  eventId: number;

  @ApiProperty({
    description: 'The attendance status',
    enum: AttendanceStatus,
    example: AttendanceStatus.REGISTERED,
  })
  status: AttendanceStatus;

  @ApiProperty({
    description: 'The date and time when the registration was created',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;
}
