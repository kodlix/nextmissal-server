import {
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'User gender',
    example: 'male',
    enum: ['male', 'female'],
  })
  @IsEnum(['male', 'female'], { message: 'Invalid gender selected' })
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+2348012345678',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'User profile image URL',
    example: 'http://example.com/profile.jpg',
  })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional({
    description: 'Is user email verified',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @ApiPropertyOptional({
    description: "Is this the user's first login",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isFirstLogin?: boolean;

  @ApiPropertyOptional({
    description: 'User date of birth',
    example: '1990-01-01',
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'User parish ID',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  parishId?: number;
}
