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
import { CreateProgrammeCommand } from './commands/create-programme.command';
import { UpdateProgrammeCommand } from './commands/update-programme.command';
import { DeleteProgrammeCommand } from './commands/delete-programme.command';
import { GetProgrammeByIdQuery } from './queries/get-programme-by-id.query';
import { GetProgrammesQuery } from './queries/get-programmes.query';
import { CreateProgrammeDto } from './dtos/create-programme.dto';
import { UpdateProgrammeDto } from './dtos/update-programme.dto';
import { ProgrammeDto } from './dtos/programme.dto';
import { GetProgrammesDto } from './dtos/get-programmes.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { ProgrammeFrequency } from '@prisma/client';

@ApiTags('Programme')
@Controller('programmes')
export class ProgrammeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new programme' })
  @ApiResponse({
    status: 201,
    description: 'The programme has been successfully created.',
    type: ProgrammeDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createProgrammeDto: CreateProgrammeDto,
    @CurrentUser() user: { id: number },
  ): Promise<ProgrammeDto> {
    const programme = await this.commandBus.execute(
      new CreateProgrammeCommand(createProgrammeDto, user.id),
    );

    return programme.props;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing programme' })
  @ApiParam({ name: 'id', description: 'The ID of the programme to update', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The programme has been successfully updated.',
    type: ProgrammeDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('id') id: number,
    @Body() updateProgrammeDto: UpdateProgrammeDto,
    @CurrentUser() user: { id: number },
  ): Promise<ProgrammeDto> {
    const programme = await this.commandBus.execute(
      new UpdateProgrammeCommand(id, updateProgrammeDto, user.id),
    );

    return programme.props;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a programme' })
  @ApiParam({ name: 'id', description: 'The ID of the programme to delete', type: Number })
  @ApiResponse({ status: 204, description: 'The programme has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async delete(@Param('id') id: number): Promise<void> {
    await this.commandBus.execute(new DeleteProgrammeCommand(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a programme by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the programme to retrieve', type: Number })
  @ApiResponse({ status: 200, description: 'The programme details.', type: ProgrammeDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async getById(@Param('id') id: number): Promise<ProgrammeDto> {
    const programme = await this.queryBus.execute(new GetProgrammeByIdQuery(id));

    return programme.props;
  }

  @Get()
  @ApiOperation({ summary: 'Get all programmes with pagination and search' })
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
    description: 'Search term for programme name or description',
    example: 'Mass',
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
  @ApiQuery({
    name: 'programmeType',
    required: false,
    type: String,
    description: 'Filter by programme type',
    example: 'Liturgy',
  })
  @ApiQuery({
    name: 'isGeneral',
    required: false,
    type: Boolean,
    description: 'Filter by general status',
    example: false,
  })
  @ApiQuery({
    name: 'frequency',
    required: false,
    enum: ProgrammeFrequency,
    description: 'Filter by frequency',
    example: ProgrammeFrequency.DAILY,
  })
  @ApiQuery({
    name: 'parishId',
    required: false,
    type: Number,
    description: 'Filter by parish ID',
    example: 1,
  })
  @ApiQuery({
    name: 'denaryId',
    required: false,
    type: Number,
    description: 'Filter by denary ID',
    example: 1,
  })
  @ApiQuery({
    name: 'dioceseId',
    required: false,
    type: Number,
    description: 'Filter by diocese ID',
    example: 1,
  })
  @ApiQuery({
    name: 'societyId',
    required: false,
    type: Number,
    description: 'Filter by society ID',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'A list of programmes.', type: [ProgrammeDto] })
  async getAll(@Query() getProgrammesDto: GetProgrammesDto): Promise<ProgrammeDto[]> {
    const programmes = await this.queryBus.execute(new GetProgrammesQuery(getProgrammesDto));

    return programmes.map(programme => programme.props);
  }

  @Get('frequencies')
  @ApiOperation({ summary: 'Get all available programme frequencies' })
  @ApiResponse({ status: 200, description: 'A list of programme frequencies.', type: [String] })
  getProgrammeFrequencies(): string[] {
    return Object.values(ProgrammeFrequency);
  }
}
