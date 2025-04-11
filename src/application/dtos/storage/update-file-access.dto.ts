import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateFileAccessDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;
}
