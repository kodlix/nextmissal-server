import { IsBooleanString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCountriesStatesDto {
  @ApiPropertyOptional({ description: 'Include LGAs in the response', type: Boolean })
  @IsOptional()
  @IsBooleanString()
  includeLgas?: boolean;
}
