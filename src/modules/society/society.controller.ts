import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateSocietyCommand } from './commands/create-society.command';
import { UpdateSocietyCommand } from './commands/update-society.command';
import { DeleteSocietyCommand } from './commands/delete-society.command';
import { GetSocietyByIdQuery } from './queries/get-society-by-id.query';
import { GetAllSocietiesQuery } from './queries/get-all-societies.query';
import { MapSocietiesToDioceseCommand } from './commands/map-societies-to-diocese.command';
import { GetMappedSocietiesQuery } from './queries/get-mapped-societies.query';
import { CreateSocietyDto } from './dtos/create-society.dto';
import { UpdateSocietyDto } from './dtos/update-society.dto';
import { SocietyDto } from './dtos/society.dto';
import { GetSocietiesDto } from './dtos/get-societies.dto';
import { MapSocietiesToDioceseDto } from './dtos/map-societies-to-diocese.dto';
import { DioceseSocietyDto } from './dtos/diocese-society.dto';
import { GetMappedSocietiesDto } from './dtos/get-mapped-societies.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

@ApiTags('Society')
@Controller('societies')
export class SocietyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new society' })
  @ApiResponse({
    status: 201,
    description: 'The society has been successfully created.',
    type: SocietyDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createSocietyDto: CreateSocietyDto,
    @CurrentUser() user: { id: number },
  ): Promise<SocietyDto> {
    const society = await this.commandBus.execute(
      new CreateSocietyCommand(createSocietyDto, user.id),
    );

    return society.props;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing society' })
  @ApiParam({ name: 'id', description: 'The ID of the society to update', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The society has been successfully updated.',
    type: SocietyDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('id') id: number,
    @Body() updateSocietyDto: UpdateSocietyDto,
    @CurrentUser() user: { id: number },
  ): Promise<SocietyDto> {
    const society = await this.commandBus.execute(
      new UpdateSocietyCommand(id, updateSocietyDto, user.id),
    );

    return society.props;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a society' })
  @ApiParam({ name: 'id', description: 'The ID of the society to delete', type: Number })
  @ApiResponse({ status: 204, description: 'The society has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async delete(@Param('id') id: number): Promise<void> {
    await this.commandBus.execute(new DeleteSocietyCommand(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a society by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the society to retrieve', type: Number })
  @ApiResponse({ status: 200, description: 'The society details.', type: SocietyDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async getById(@Param('id') id: number): Promise<SocietyDto> {
    const society = await this.queryBus.execute(new GetSocietyByIdQuery(id));

    return society.props;
  }

  @Get()
  @ApiOperation({ summary: 'Get all societies with pagination and search' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for society name or description',
    example: 'Catholic',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order (e.g., name:asc, createdAt:desc)',
    example: 'name:asc',
  })
  @ApiResponse({ status: 200, description: 'A list of societies.', type: [SocietyDto] })
  async getAll(@Query() getSocietiesDto: GetSocietiesDto): Promise<SocietyDto[]> {
    const societies = await this.queryBus.execute(new GetAllSocietiesQuery(getSocietiesDto));

    return societies.map(society => society.props);
  }

  @Post(':dioceseId/map-societies')
  @ApiOperation({ summary: 'Map societies to a diocese' })
  @ApiParam({ name: 'dioceseId', description: 'The ID of the diocese', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Societies successfully mapped to the diocese.',
    type: [DioceseSocietyDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async mapSocietiesToDiocese(
    @Param('dioceseId') dioceseId: number,
    @Body() mapSocietiesToDioceseDto: MapSocietiesToDioceseDto,
    @CurrentUser() user: { id: number },
  ): Promise<DioceseSocietyDto[]> {
    mapSocietiesToDioceseDto.dioceseId = Number(dioceseId);
    const mappedSocieties = await this.commandBus.execute(
      new MapSocietiesToDioceseCommand(mapSocietiesToDioceseDto, user.id),
    );

    return mappedSocieties.map(ds => ds.props);
  }

  @Get(':dioceseId/mapped-societies')
  @ApiOperation({ summary: 'Get all societies mapped to a diocese with pagination and search' })
  @ApiParam({ name: 'dioceseId', description: 'The ID of the diocese', type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for society name or description',
    example: 'Catholic',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order (e.g., name:asc, createdAt:desc)',
    example: 'name:asc',
  })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'A list of mapped societies.',
    type: [DioceseSocietyDto],
  })
  async getMappedSocieties(
    @Param('dioceseId') dioceseId: number,
    @Query() getMappedSocietiesDto: GetMappedSocietiesDto,
  ): Promise<DioceseSocietyDto[]> {
    const mappedSocieties = await this.queryBus.execute(
      new GetMappedSocietiesQuery(Number(dioceseId), getMappedSocietiesDto),
    );

    return mappedSocieties.map(ds => ds.props);
  }
}
