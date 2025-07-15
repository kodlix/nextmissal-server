import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateDioceseDto {
  @ApiPropertyOptional({ description: 'The name of the diocese' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'The profile of the diocese' })
  @IsOptional()
  @IsString()
  profile?: string;

  @ApiPropertyOptional({ description: 'The cathedral of the diocese' })
  @IsOptional()
  @IsString()
  cathedral?: string;

  @ApiPropertyOptional({ description: 'The address of the diocese' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'The telephone numbers of the diocese' })
  @IsOptional()
  @IsString()
  telephones?: string;

  @ApiPropertyOptional({ description: 'The email addresses of the diocese' })
  @IsOptional()
  @IsString()
  emails?: string;

  @ApiPropertyOptional({ description: 'The province of the diocese' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ description: 'The bishop of the diocese' })
  @IsOptional()
  @IsString()
  bishop?: string;

  @ApiPropertyOptional({ description: 'Is the diocese an archdiocese?' })
  @IsOptional()
  isArchidiocese?: boolean;

  @ApiPropertyOptional({ description: 'The ID of the country the diocese belongs to' })
  @IsOptional()
  @IsNumber()
  countryId?: number;

  @ApiPropertyOptional({ description: 'Is the diocese active?' })
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ description: 'The ID of the user who updated this record' })
  @IsOptional()
  @IsNumber()
  updatedBy?: number;
}
