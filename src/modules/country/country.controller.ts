import { Controller, Get, Query, Param } from '@nestjs/common';
import { CountryService } from './country.service';
import { GetCountriesStatesDto } from './dto/get-countries-states.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Country } from './dto/country.dto';
import { Public } from '@shared/decorators/public.decorator';

@ApiTags('Country')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all countries with pagination' })
  @ApiOkResponse({ description: 'Successfully retrieved countries', type: [Country] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.countryService.findAllCountries(paginationDto);
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
    return this.countryService.findAllCountriesWithStates(countryId, query.includeLgas);
  }

  @Public()
  @Get(':countryId/states/:id')
  @ApiOperation({ summary: 'Get a state by ID or name with its LGAs' })
  @ApiOkResponse({ description: 'Successfully retrieved state with LGAs' })
  findStateWithLgas(@Param('countryId') countryId: number, @Param('id') id: number) {
    return this.countryService.findStateWithLgas(countryId, id);
  }
}
