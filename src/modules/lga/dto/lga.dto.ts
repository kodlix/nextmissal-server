import { IsString, IsInt } from 'class-validator';

export class LgaDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  stateId: number;
}
