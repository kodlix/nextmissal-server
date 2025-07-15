import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ToBoolean } from '@shared/transformer/to-boolean';

export class CreateParishDto {
  @ApiProperty({ description: 'The name of the parish', example: 'St. Peter' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The profile of the parish', required: false })
  @IsOptional()
  @IsString()
  profile?: string;

  @ApiProperty({ description: 'The email of the parish', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'The telephone of the parish', required: false })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({ description: 'The slogan of the parish', required: false })
  @IsOptional()
  @IsString()
  slogan?: string;

  @ApiProperty({ description: 'The address of the parish', example: '123 Main St' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'The town of the parish', example: 'Anytown' })
  @IsNotEmpty()
  @IsString()
  town: string;

  @ApiProperty({ description: 'The LGA of the parish', required: false })
  @IsOptional()
  @IsString()
  lga?: string;

  @ApiProperty({ description: 'The state of the parish', example: 'Anystate' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ description: 'The post office address of the parish', required: false })
  @IsOptional()
  @IsString()
  postOfficeAddress?: string;

  @ApiProperty({ description: 'The website of the parish', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'The logo URL of the parish', required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ description: 'The vision of the parish', required: false })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiProperty({ description: 'The mission of the parish', required: false })
  @IsOptional()
  @IsString()
  mission?: string;

  @ApiProperty({
    description: 'The established date of the parish',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  establishedOn?: Date;

  @ApiProperty({ description: 'Whether the parish is active', example: true })
  @IsNotEmpty()
  @ToBoolean()
  active: boolean;

  @ApiProperty({ description: 'Whether the parish is a station', example: false })
  @IsNotEmpty()
  @ToBoolean()
  isStation: boolean;

  @ApiProperty({ description: 'The ID of the parent parish, if any', required: false })
  @IsOptional()
  @IsNumber()
  parentParishId?: number;

  @ApiProperty({ description: 'The ID of the denary this parish belongs to', required: false })
  @IsOptional()
  @IsNumber()
  denaryId?: number;

  @ApiProperty({ description: 'The name of the parish priest', required: false })
  @IsOptional()
  @IsString()
  parishPriest?: string;

  @ApiProperty({ description: 'The name of the first assistant priest', required: false })
  @IsOptional()
  @IsString()
  assistantPriest1?: string;

  @ApiProperty({ description: 'The name of the second assistant priest', required: false })
  @IsOptional()
  @IsString()
  assistantPriest2?: string;

  @ApiProperty({ description: 'The phone number of the parish priest', required: false })
  @IsOptional()
  @IsString()
  parishPriestPhoneNumber?: string;

  @ApiProperty({ description: 'The phone number of the first assistant priest', required: false })
  @IsOptional()
  @IsString()
  assistantPriest1PhoneNumber?: string;

  @ApiProperty({ description: 'The phone number of the second assistant priest', required: false })
  @IsOptional()
  @IsString()
  assistantPriest2PhoneNumber?: string;

  @ApiProperty({ description: 'The ID of the user who created this record', required: false })
  @IsOptional()
  @IsNumber()
  createdBy?: number;
}
