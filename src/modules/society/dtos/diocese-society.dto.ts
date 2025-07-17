import { ApiProperty } from '@nestjs/swagger';
import { DioceseSociety } from '@prisma/client';

export class DioceseSocietyDto implements DioceseSociety {
  @ApiProperty({ description: 'The unique identifier of the diocese-society mapping', example: 1 })
  id: number;

  @ApiProperty({ description: 'The ID of the diocese', example: 1 })
  dioceseId: number;

  @ApiProperty({ description: 'The ID of the society', example: 1 })
  societyId: number;

  @ApiProperty({
    description: 'Description for the society mapping',
    example: 'Main society for the diocese',
  })
  description: string;

  @ApiProperty({ description: 'Whether the mapping is active', example: true })
  active: boolean;

  @ApiProperty({
    description: 'The date and time when the mapping was created',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the mapping was last updated',
    example: '2023-01-01T12:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The ID of the user who created the mapping',
    example: 1,
    nullable: true,
  })
  createdBy: number;

  @ApiProperty({
    description: 'The ID of the user who last updated the mapping',
    example: 1,
    nullable: true,
  })
  updatedBy: number;
}
