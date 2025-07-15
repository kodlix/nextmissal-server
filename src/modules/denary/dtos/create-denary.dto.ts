import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDenaryDto {
  @ApiProperty({ description: 'The name of the denary', example: 'Denary of Ikeja' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The dean of the denary', example: 'Rev. Fr. John Doe' })
  @IsNotEmpty()
  @IsString()
  dean: string;

  @ApiProperty({ description: 'The address of the denary', example: '456 Oak Ave' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'The ID of the diocese this denary belongs to', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  dioceseId: number;

  @ApiProperty({ description: 'The profile of the denary', example: 'A brief description' })
  @IsNotEmpty()
  @IsString()
  profile: string;

  @ApiProperty({ description: 'Is the denary active?', example: true })
  @IsNotEmpty()
  active: boolean;

  @ApiProperty({ description: 'The ID of the user who created this record', required: false })
  @IsOptional()
  @IsNumber()
  createdBy?: number;
}
