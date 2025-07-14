import { ApiProperty } from '@nestjs/swagger';
import { Country as PrismaCountry } from '@prisma/client';

export class Country implements PrismaCountry {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  code2: string | null;

  @ApiProperty({ required: false, nullable: true })
  code3: string | null;

  @ApiProperty({ required: false, nullable: true })
  capital: string | null;

  @ApiProperty({ required: false, nullable: true })
  region: string | null;

  @ApiProperty({ required: false, nullable: true })
  subregion: string | null;
}
