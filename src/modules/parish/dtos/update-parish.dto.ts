import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { ToBoolean } from '@shared/transformer/to-boolean';

export class UpdateParishDto {
  @ApiPropertyOptional({ description: 'The name of the parish' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'The profile of the parish' })
  @IsOptional()
  @IsString()
  profile?: string;

  @ApiPropertyOptional({ description: 'The email of the parish' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'The telephone of the parish' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({ description: 'The slogan of the parish' })
  @IsOptional()
  @IsString()
  slogan?: string;

  @ApiPropertyOptional({ description: 'The address of the parish' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'The town of the parish' })
  @IsOptional()
  @IsString()
  town?: string;

  @ApiPropertyOptional({ description: 'The LGA of the parish' })
  @IsOptional()
  @IsString()
  lga?: string;

  @ApiPropertyOptional({ description: 'The state of the parish' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'The post office address of the parish' })
  @IsOptional()
  @IsString()
  postOfficeAddress?: string;

  @ApiPropertyOptional({ description: 'The website of the parish' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'The logo URL of the parish' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ description: 'The vision of the parish' })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiPropertyOptional({ description: 'The mission of the parish' })
  @IsOptional()
  @IsString()
  mission?: string;

  @ApiPropertyOptional({
    description: 'The established date of the parish',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  establishedOn?: Date;

  @ApiPropertyOptional({ description: 'Whether the parish is active' })
  @IsOptional()
  @ToBoolean()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Whether the parish is a station' })
  @IsOptional()
  @ToBoolean()
  isStation?: boolean;

  @ApiPropertyOptional({ description: 'The ID of the parent parish, if any' })
  @IsOptional()
  @IsNumber()
  parentParishId?: number;

  @ApiPropertyOptional({ description: 'The ID of the denary this parish belongs to' })
  @IsOptional()
  @IsNumber()
  denaryId?: number;

  @ApiPropertyOptional({ description: 'The name of the parish priest' })
  @IsOptional()
  @IsString()
  parishPriest?: string;

  @ApiPropertyOptional({ description: 'The name of the first assistant priest' })
  @IsOptional()
  @IsString()
  assistantPriest1?: string;

  @ApiPropertyOptional({ description: 'The name of the second assistant priest' })
  @IsOptional()
  @IsString()
  assistantPriest2?: string;

  @ApiPropertyOptional({ description: 'The phone number of the parish priest' })
  @IsOptional()
  @IsString()
  parishPriestPhoneNumber?: string;

  @ApiPropertyOptional({ description: 'The phone number of the first assistant priest' })
  @IsOptional()
  @IsString()
  assistantPriest1PhoneNumber?: string;

  @ApiPropertyOptional({ description: 'The phone number of the second assistant priest' })
  @IsOptional()
  @IsString()
  assistantPriest2PhoneNumber?: string;

  @ApiPropertyOptional({ description: 'The ID of the user who updated this record' })
  @IsOptional()
  @IsNumber()
  updatedBy?: number;
}
