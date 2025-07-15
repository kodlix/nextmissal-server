import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DenaryDto {
  @ApiProperty({ description: 'The ID of the denary', example: 1 })
  id: number;

  @ApiProperty({ description: 'The name of the denary', example: 'Denary of Ikeja' })
  name: string;

  @ApiProperty({ description: 'The dean of the denary', example: 'Rev. Fr. John Doe' })
  dean: string;

  @ApiProperty({ description: 'The address of the denary', example: '456 Oak Ave' })
  address: string;

  @ApiProperty({ description: 'The ID of the diocese this denary belongs to', example: 1 })
  dioceseId: number;

  @ApiProperty({ description: 'The profile of the denary', example: 'A brief description' })
  profile: string;

  @ApiProperty({ description: 'Is the denary active?', example: true })
  active: boolean;

  @ApiProperty({ description: 'The date the denary was created', example: '2023-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the denary was last updated',
    example: '2023-01-01T12:00:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'The ID of the user who created the denary', example: 1 })
  createdBy?: number;

  @ApiPropertyOptional({
    description: 'The ID of the user who last updated the denary',
    example: 1,
  })
  updatedBy?: number;
}
