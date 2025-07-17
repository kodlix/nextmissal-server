import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SocietyMappingItemDto {
  @ApiProperty({ description: 'The ID of the society to map', example: 1 })
  @IsInt()
  @IsNotEmpty()
  societyId: number;

  @ApiProperty({
    description: 'Description for the society mapping',
    example: 'Main society for the diocese',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the mapping is active',
    example: true,
    default: true,
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class MapSocietiesToDioceseDto {
  @ApiProperty({ description: 'The ID of the diocese to map societies to', example: 1 })
  @IsInt()
  @IsNotEmpty()
  dioceseId: number;

  @ApiProperty({
    type: [SocietyMappingItemDto],
    description: 'List of societies to map to the diocese',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocietyMappingItemDto)
  societies: SocietyMappingItemDto[];
}
