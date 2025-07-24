import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class RegisterEventAttendeeDto {
  @ApiProperty({ description: 'The ID of the event to register for', example: 1 })
  @IsInt()
  @IsNotEmpty()
  eventId: number;

  @ApiPropertyOptional({
    description: 'The status of the attendance',
    enum: AttendanceStatus,
    example: AttendanceStatus.REGISTERED,
    default: AttendanceStatus.REGISTERED,
  })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;
}
