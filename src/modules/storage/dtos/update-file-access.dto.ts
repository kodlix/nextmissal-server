import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateFileAccessDto {
  @IsString()
  @IsNotEmpty()
  fileId!: bigint;

  @IsBoolean()
  @IsNotEmpty()
  isPublic!: boolean;
}
