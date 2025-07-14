import { Injectable } from '@nestjs/common';
import { CountryRepository } from './country.repository';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async findAllCountries(paginationDto: PaginationDto) {
    const page = paginationDto.page ? parseInt(paginationDto.page, 10) : 1;
    const limit = paginationDto.limit ? parseInt(paginationDto.limit, 10) : 10;
    const skip = (page - 1) * limit;

    const [countries, total] = await Promise.all([
      this.countryRepository.findAll(skip, limit),
      this.countryRepository.countAllCountries(),
    ]);

    return {
      data: countries,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findAllCountriesWithStates(countryId: number, includeLgas: boolean) {
    return this.countryRepository.findAllWithStates(countryId, includeLgas);
  }

  async findStateWithLgas(countryId: number, id: number) {
    return await this.countryRepository.findStateWithLgas(countryId, id);
  }
}
