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
import { CreateDenaryCommand } from './commands/create-denary.command';
import { UpdateDenaryCommand } from './commands/update-denary.command';
import { DeleteDenaryCommand } from './commands/delete-denary.command';
import { GetDenaryByIdQuery } from './queries/get-denary-by-id.query';
import { GetDenariesQuery } from './queries/get-denaries.query';
import { CreateDenaryDto } from './dtos/create-denary.dto';
import { UpdateDenaryDto } from './dtos/update-denary.dto';
import { DenaryDto } from './dtos/denary.dto';
import { GetDenariesDto } from './dtos/get-denaries.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

@ApiTags('Denary')
@Controller('denary')
export class DenaryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new denary' })
  @ApiResponse({
    status: 201,
    description: 'The denary has been successfully created.',
    type: DenaryDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createDenaryDto: CreateDenaryDto,
    @CurrentUser() user: { id: number },
  ): Promise<DenaryDto> {
    const denary = await this.commandBus.execute(new CreateDenaryCommand(createDenaryDto, user.id));

    return denary.props;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing denary' })
  @ApiParam({ name: 'id', description: 'The ID of the denary to update', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The denary has been successfully updated.',
    type: DenaryDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('id') id: number,
    @Body() updateDenaryDto: UpdateDenaryDto,
    @CurrentUser() user: { id: number },
  ): Promise<DenaryDto> {
    const denary = await this.commandBus.execute(
      new UpdateDenaryCommand(id, updateDenaryDto, user.id),
    );

    return denary.props;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a denary' })
  @ApiParam({ name: 'id', description: 'The ID of the denary to delete', type: Number })
  @ApiResponse({ status: 204, description: 'The denary has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async delete(@Param('id') id: number): Promise<void> {
    await this.commandBus.execute(new DeleteDenaryCommand(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a denary by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the denary to retrieve', type: Number })
  @ApiResponse({ status: 200, description: 'The denary details.', type: DenaryDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async getById(@Param('id') id: number): Promise<DenaryDto> {
    const denary = await this.queryBus.execute(new GetDenaryByIdQuery(id));

    return denary.props;
  }

  @Get()
  @ApiOperation({ summary: 'Get all denaries with pagination and search' })
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
    description: 'Search term for denary name',
    example: 'Ikeja',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order (e.g., name:asc, createdAt:desc)',
    example: 'name:asc',
  })
  @ApiQuery({
    name: 'dioceseId',
    required: false,
    type: Number,
    description: 'Filter by diocese ID',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'A list of denaries.', type: [DenaryDto] })
  async getAll(@Query() getDenariesDto: GetDenariesDto): Promise<DenaryDto[]> {
    const denaries = await this.queryBus.execute(new GetDenariesQuery(getDenariesDto));

    return denaries.map(denary => denary.props);
  }
}
