import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ContentType } from '@prisma/client';

export class CreateComplaintDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contentId: string;

  @ApiProperty({ enum: ContentType })
  @IsEnum(ContentType)
  @IsNotEmpty()
  contentType: ContentType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty()
  @IsString()
  details?: string;
}
