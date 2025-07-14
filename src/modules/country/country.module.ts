import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CountryController } from './country.controller';
import { CountryRepository } from './country.repository';
import { PrismaModule } from '../../core/database/prisma/prisma.module';
import { GetCountriesQueryHandler } from './queries/get-countries.query';
import { GetCountryWithStatesQueryHandler } from './queries/get-country-with-states.query';
import { GetStateWithLgasQueryHandler } from './queries/get-state-with-lgas.query';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [CountryController],
  providers: [
    CountryRepository,
    GetCountriesQueryHandler,
    GetCountryWithStatesQueryHandler,
    GetStateWithLgasQueryHandler,
  ],
  exports: [CountryRepository],
})
export class CountryModule {}
