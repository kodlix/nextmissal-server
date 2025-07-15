import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DioceseDto {
  @ApiProperty({ description: 'The ID of the diocese', example: 1 })
  id: number;

  @ApiProperty({ description: 'The name of the diocese', example: 'Diocese of Lagos' })
  name: string;

  @ApiProperty({ description: 'The profile of the diocese', example: 'A brief description' })
  profile: string;

  @ApiPropertyOptional({ description: 'The cathedral of the diocese' })
  cathedral?: string;

  @ApiPropertyOptional({ description: 'The address of the diocese', example: '123 Main St' })
  address?: string;

  @ApiPropertyOptional({
    description: 'The telephone numbers of the diocese',
    example: '123-456-7890',
  })
  telephones?: string;

  @ApiPropertyOptional({
    description: 'The email addresses of the diocese',
    example: 'info@diocese.org',
  })
  emails?: string;

  @ApiPropertyOptional({ description: 'The province of the diocese', example: 'Lagos Province' })
  province?: string;

  @ApiPropertyOptional({ description: 'The bishop of the diocese', example: 'Bishop John Doe' })
  bishop?: string;

  @ApiProperty({ description: 'Is the diocese an archdiocese?', example: false })
  isArchidiocese: boolean;

  @ApiProperty({ description: 'The ID of the country the diocese belongs to', example: 1 })
  countryId: number;

  @ApiProperty({ description: 'Is the diocese active?', example: true })
  active: boolean;

  @ApiProperty({ description: 'The date the diocese was created', example: '2023-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the diocese was last updated',
    example: '2023-01-01T12:00:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'The ID of the user who created the diocese', example: 1 })
  createdBy?: number;

  @ApiPropertyOptional({
    description: 'The ID of the user who last updated the diocese',
    example: 1,
  })
  updatedBy?: number;
}
