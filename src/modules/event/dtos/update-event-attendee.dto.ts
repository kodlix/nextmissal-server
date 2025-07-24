import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class UpdateEventAttendeeDto {
  @ApiPropertyOptional({
    description: 'The new status of the attendance',
    enum: AttendanceStatus,
    example: AttendanceStatus.CHECKED_IN,
  })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;
}
