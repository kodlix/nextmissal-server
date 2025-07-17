import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateSocietyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  shortName?: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
