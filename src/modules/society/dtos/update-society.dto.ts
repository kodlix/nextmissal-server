import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateSocietyDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  shortName?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
