import { ApiProperty } from '@nestjs/swagger';

export class ParishDto {
  @ApiProperty({ description: 'The ID of the parish', example: 1 })
  id: number;

  @ApiProperty({ description: 'The name of the parish', example: 'St. Peter' })
  name: string;

  @ApiProperty({ description: 'The profile of the parish', required: false })
  profile?: string;

  @ApiProperty({ description: 'The email of the parish', required: false })
  email?: string;

  @ApiProperty({ description: 'The telephone of the parish', required: false })
  telephone?: string;

  @ApiProperty({ description: 'The slogan of the parish', required: false })
  slogan?: string;

  @ApiProperty({ description: 'The address of the parish', example: '123 Main St' })
  address: string;

  @ApiProperty({ description: 'The town of the parish', example: 'Anytown' })
  town: string;

  @ApiProperty({ description: 'The LGA of the parish', required: false })
  lga?: string;

  @ApiProperty({ description: 'The state of the parish', example: 'Anystate' })
  state: string;

  @ApiProperty({ description: 'The post office address of the parish', required: false })
  postOfficeAddress?: string;

  @ApiProperty({ description: 'The website of the parish', required: false })
  website?: string;

  @ApiProperty({ description: 'The logo URL of the parish', required: false })
  logo?: string;

  @ApiProperty({ description: 'The vision of the parish', required: false })
  vision?: string;

  @ApiProperty({ description: 'The mission of the parish', required: false })
  mission?: string;

  @ApiProperty({
    description: 'The established date of the parish',
    required: false,
    type: String,
    format: 'date-time',
  })
  establishedOn?: Date;

  @ApiProperty({ description: 'Whether the parish is active', example: true })
  active: boolean;

  @ApiProperty({ description: 'Whether the parish is a station', example: false })
  isStation: boolean;

  @ApiProperty({ description: 'The ID of the parent parish, if any', required: false })
  parentParishId?: number;

  @ApiProperty({ description: 'The ID of the denary this parish belongs to', required: false })
  denaryId?: number;

  @ApiProperty({ description: 'The name of the parish priest', required: false })
  parishPriest?: string;

  @ApiProperty({ description: 'The name of the first assistant priest', required: false })
  assistantPriest1?: string;

  @ApiProperty({ description: 'The name of the second assistant priest', required: false })
  assistantPriest2?: string;

  @ApiProperty({ description: 'The phone number of the parish priest', required: false })
  parishPriestPhoneNumber?: string;

  @ApiProperty({ description: 'The phone number of the first assistant priest', required: false })
  assistantPriest1PhoneNumber?: string;

  @ApiProperty({ description: 'The phone number of the second assistant priest', required: false })
  assistantPriest2PhoneNumber?: string;

  @ApiProperty({
    description: 'The creation date of the parish',
    example: '2023-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the parish',
    example: '2023-01-01T12:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({ description: 'The ID of the user who created this record', required: false })
  createdBy?: number;

  @ApiProperty({ description: 'The ID of the user who updated this record', required: false })
  updatedBy?: number;
}
