import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Setup2FADto {
  @ApiProperty({
    description: 'The user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class Verify2FADto {
  @ApiProperty({
    description: 'The user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The 2FA verification token',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class Disable2FADto {
  @ApiProperty({
    description: 'The user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class Generate2FADto {
  @ApiProperty({
    description: 'The user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}