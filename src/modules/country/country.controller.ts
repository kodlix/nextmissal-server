import { Controller, Get, Query, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCountriesQuery } from './queries/get-countries.query';
import { GetCountryWithStatesQuery } from './queries/get-country-with-states.query';
import { GetStateWithLgasQuery } from './queries/get-state-with-lgas.query';
import { GetCountriesStatesDto } from './dto/get-countries-states.dto';
import { PaginationDto } from '@shared/dtos/pagination.dto';
import { ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { CountryDto } from './dto/country.dto';
import { Public } from '@shared/decorators/public.decorator';

@ApiTags('Country')
@Controller('country')
export class CountryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all countries with pagination' })
  @ApiOkResponse({ description: 'Successfully retrieved countries', type: [CountryDto] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for country name',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.queryBus.execute(
      new GetCountriesQuery(paginationDto.page, paginationDto.limit, paginationDto.search),
    );
  }

  @Public()
  @Get(':countryId/states')
  @ApiOperation({ summary: 'Get all countries with their states' })
  @ApiOkResponse({ description: 'Successfully retrieved countries with states' })
  @ApiQuery({
    name: 'includeLgas',
    required: false,
    type: Boolean,
    description: 'Include LGAs in the response',
  })
  findAllWithStates(@Param('countryId') countryId: number, @Query() query: GetCountriesStatesDto) {
    return this.queryBus.execute(new GetCountryWithStatesQuery(countryId, query.includeLgas));
  }

  @Public()
  @Get(':countryId/states/:id')
  @ApiOperation({ summary: 'Get a state by ID or name with its LGAs' })
  @ApiOkResponse({ description: 'Successfully retrieved state with LGAs' })
  findStateWithLgas(@Param('countryId') countryId: number, @Param('id') id: number) {
    return this.queryBus.execute(new GetStateWithLgasQuery(countryId, id));
  }
}
