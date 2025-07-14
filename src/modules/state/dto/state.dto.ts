import { IsString, IsInt } from 'class-validator';

export class StateDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  countryId: number;
}
