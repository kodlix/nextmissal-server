import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ToBoolean } from '@shared/transformer/to-boolean';

export class GetCountriesStatesDto {
  @ApiPropertyOptional({ description: 'Include LGAs in the response', type: Boolean })
  @IsOptional()
  @ToBoolean()
  includeLgas?: boolean;
}
