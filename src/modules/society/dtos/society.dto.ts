import { ApiProperty } from '@nestjs/swagger';
import { Society } from '@prisma/client';

export class SocietyDto implements Society {
  @ApiProperty({
    description: 'The unique identifier of the society',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the society',
    example: 'Catholic Charismatic Renewal',
  })
  name: string;

  @ApiProperty({
    description: 'The short name or acronym of the society',
    example: 'CCR',
    nullable: true,
  })
  shortName: string;

  @ApiProperty({
    description: 'A detailed description of the society',
    example: 'A movement within the Catholic Church that is charismatic in nature.',
  })
  description: string;

  @ApiProperty({
    description: 'Indicates if the society is active',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'The date and time when the society was created',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the society was last updated',
    example: '2023-01-01T12:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The ID of the user who created the society',
    example: 1,
    nullable: true,
  })
  createdBy: number;

  @ApiProperty({
    description: 'The ID of the user who last updated the society',
    example: 1,
    nullable: true,
  })
  updatedBy: number;
}
