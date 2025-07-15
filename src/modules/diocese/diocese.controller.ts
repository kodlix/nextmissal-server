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
import { CreateDioceseCommand } from './commands/create-diocese.command';
import { UpdateDioceseCommand } from './commands/update-diocese.command';
import { DeleteDioceseCommand } from './commands/delete-diocese.command';
import { GetDioceseByIdQuery } from './queries/get-diocese-by-id.query';
import { GetDiocesesQuery } from './queries/get-dioceses.query';
import { CreateDioceseDto } from './dtos/create-diocese.dto';
import { UpdateDioceseDto } from './dtos/update-diocese.dto';
import { DioceseDto } from './dtos/diocese.dto';
import { GetDiocesesDto } from './dtos/get-dioceses.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

@ApiTags('Diocese')
@Controller('diocese')
export class DioceseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new diocese' })
  @ApiResponse({
    status: 201,
    description: 'The diocese has been successfully created.',
    type: DioceseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createDioceseDto: CreateDioceseDto,
    @CurrentUser() user: { id: number },
  ): Promise<DioceseDto> {
    const diocese = await this.commandBus.execute(
      new CreateDioceseCommand(createDioceseDto, user.id),
    );

    return diocese.props;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing diocese' })
  @ApiParam({ name: 'id', description: 'The ID of the diocese to update', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The diocese has been successfully updated.',
    type: DioceseDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('id') id: number,
    @Body() updateDioceseDto: UpdateDioceseDto,
    @CurrentUser() user: { id: number },
  ): Promise<DioceseDto> {
    const diocese = await this.commandBus.execute(
      new UpdateDioceseCommand(id, updateDioceseDto, user.id),
    );

    return diocese.props;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a diocese' })
  @ApiParam({ name: 'id', description: 'The ID of the diocese to delete', type: Number })
  @ApiResponse({ status: 204, description: 'The diocese has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async delete(@Param('id') id: number): Promise<void> {
    await this.commandBus.execute(new DeleteDioceseCommand(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a diocese by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the diocese to retrieve', type: Number })
  @ApiResponse({ status: 200, description: 'The diocese details.', type: DioceseDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async getById(@Param('id') id: number): Promise<DioceseDto> {
    const diocese = await this.queryBus.execute(new GetDioceseByIdQuery(id));

    return diocese.props;
  }

  @Get()
  @ApiOperation({ summary: 'Get all dioceses with pagination and search' })
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
    description: 'Search term for diocese name or country',
    example: 'Lagos',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order (e.g., name:asc, createdAt:desc)',
    example: 'name:asc',
  })
  @ApiResponse({ status: 200, description: 'A list of dioceses.', type: [DioceseDto] })
  async getAll(@Query() getDiocesesDto: GetDiocesesDto): Promise<DioceseDto[]> {
    const dioceses = await this.queryBus.execute(new GetDiocesesQuery(getDiocesesDto));

    return dioceses.map(diocese => diocese.props);
  }
}
