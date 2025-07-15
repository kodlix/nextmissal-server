import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateDenaryDto {
  @ApiPropertyOptional({ description: 'The name of the denary' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'The dean of the denary' })
  @IsOptional()
  @IsString()
  dean?: string;

  @ApiPropertyOptional({ description: 'The address of the denary' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'The ID of the diocese this denary belongs to' })
  @IsOptional()
  @IsNumber()
  dioceseId?: number;

  @ApiPropertyOptional({ description: 'The profile of the denary' })
  @IsOptional()
  @IsString()
  profile?: string;

  @ApiPropertyOptional({ description: 'Is the denary active?' })
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ description: 'The ID of the user who updated this record' })
  @IsOptional()
  @IsNumber()
  updatedBy?: number;
}
