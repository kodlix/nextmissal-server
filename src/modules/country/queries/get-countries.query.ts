import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CountryRepository } from '../country.repository';
import { Paginated } from '@shared/dtos/paginated.dto';
import { CountryDto } from '../dto/country.dto';

export class GetCountriesQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly search?: string,
    public readonly sort?: string,
  ) {}
}

@QueryHandler(GetCountriesQuery)
export class GetCountriesQueryHandler implements IQueryHandler<GetCountriesQuery> {
  constructor(
    @Inject(CountryRepository)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(query: GetCountriesQuery): Promise<Paginated<CountryDto>> {
    const [countries, total] = await Promise.all([
      this.countryRepository.findAll(query.page, query.limit, query.search),
      this.countryRepository.countAllCountries(query.search),
    ]);

    return new Paginated<CountryDto>(countries, total, query.page, query.limit);
  }
}
