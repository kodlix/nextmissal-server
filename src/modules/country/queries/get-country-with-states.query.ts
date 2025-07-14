import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CountryRepository } from '../country.repository';
import { CountryDto } from '../dto/country.dto';

export class GetCountryWithStatesQuery implements IQuery {
  constructor(
    public readonly countryId: number,
    public readonly includeLgas: boolean,
  ) {}
}

@QueryHandler(GetCountryWithStatesQuery)
export class GetCountryWithStatesQueryHandler implements IQueryHandler<GetCountryWithStatesQuery> {
  constructor(
    @Inject(CountryRepository)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(query: GetCountryWithStatesQuery): Promise<CountryDto[]> {
    return this.countryRepository.findAllWithStates(query.countryId, query.includeLgas);
  }
}
