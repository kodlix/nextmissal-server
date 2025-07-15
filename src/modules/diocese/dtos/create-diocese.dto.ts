import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDioceseDto {
  @ApiProperty({ description: 'The name of the diocese', example: 'Diocese of Lagos' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The profile of the diocese', example: 'A brief description' })
  @IsNotEmpty()
  @IsString()
  profile: string;

  @ApiPropertyOptional({
    description: 'The cathedral of the diocese',
    example: 'St. Peters `Cathedral',
  })
  @IsOptional()
  @IsString()
  cathedral?: string;

  @ApiPropertyOptional({ description: 'The address of the diocese', example: '123 Main St' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'The telephone numbers of the diocese',
    example: '123-456-7890',
  })
  @IsOptional()
  @IsString()
  telephones?: string;

  @ApiPropertyOptional({
    description: 'The email addresses of the diocese',
    example: 'info@diocese.org',
  })
  @IsOptional()
  @IsString()
  emails?: string;

  @ApiPropertyOptional({ description: 'The province of the diocese', example: 'Lagos Province' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ description: 'The bishop of the diocese', example: 'Bishop John Doe' })
  @IsOptional()
  @IsString()
  bishop?: string;

  @ApiProperty({ description: 'Is the diocese an archdiocese?', example: false })
  @IsNotEmpty()
  isArchidiocese: boolean;

  @ApiProperty({ description: 'The ID of the country the diocese belongs to', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  countryId: number;

  @ApiProperty({ description: 'Is the diocese active?', example: true })
  @IsNotEmpty()
  active: boolean;

  @ApiProperty({ description: 'The ID of the user who created this record', required: false })
  @IsOptional()
  @IsNumber()
  createdBy?: number;
}
