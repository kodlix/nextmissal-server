import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class UserDto {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  id: bigint;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
  email: string;

  @ApiProperty({ example: 'johndoe', description: 'The username of the user' })
  username: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName: string;

  @ApiProperty({ example: 'male', description: 'The gender of the user' })
  gender: string;

  @ApiProperty({ example: false, description: 'Whether the user account is active' })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Whether two-factor authentication is enabled' })
  otpEnabled: boolean;

  @ApiProperty({ example: 'secret', description: 'The OTP secret', required: false })
  otpSecret: string | null;

  @ApiProperty({
    example: '2024-07-24T12:00:00Z',
    description: 'The last login timestamp',
    required: false,
  })
  lastLoginAt: Date | null;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
    required: false,
  })
  phoneNumber: string | null;

  @ApiProperty({
    example: UserType.USER,
    description: 'The type of user',
    enum: UserType,
    required: false,
  })
  userType: UserType | null;

  @ApiProperty({
    example: 'http://example.com/profile.jpg',
    description: `The URL of the user's profile image`,
    required: false,
  })
  profileImage: string | null;

  @ApiProperty({ example: true, description: `Whether the user's email is verified` })
  emailVerified: boolean;

  @ApiProperty({ example: false, description: `Whether it's the user's first login` })
  isFirstLogin: boolean;

  @ApiProperty({
    example: '1990-01-01T00:00:00Z',
    description: 'The date of birth of the user',
    required: false,
  })
  dateOfBirth: Date | null;

  @ApiProperty({
    example: 1,
    description: 'The ID of the parish the user belongs to',
    required: false,
  })
  parishId: number | null;

  @ApiProperty({ example: '2024-07-24T12:00:00Z', description: 'The creation date of the user' })
  createdAt: Date;

  @ApiProperty({ example: '2024-07-24T12:00:00Z', description: 'The last update date of the user' })
  updatedAt: Date;
}
