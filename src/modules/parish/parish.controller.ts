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
import { CreateParishCommand } from './commands/create-parish.command';
import { UpdateParishCommand } from './commands/update-parish.command';
import { DeleteParishCommand } from './commands/delete-parish.command';
import { GetParishByIdQuery } from './queries/get-parish-by-id.query';
import { GetParishesQuery } from './queries/get-parishes.query';
import { CreateParishDto } from './dtos/create-parish.dto';
import { UpdateParishDto } from './dtos/update-parish.dto';
import { ParishDto } from './dtos/parish.dto';
import { GetParishesDto } from './dtos/get-parishes.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

@ApiTags('Parish')
@Controller('parish')
export class ParishController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new parish' })
  @ApiResponse({
    status: 201,
    description: 'The parish has been successfully created.',
    type: ParishDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createParishDto: CreateParishDto,
    @CurrentUser() user: { userId: number },
  ): Promise<ParishDto> {
    const parish = await this.commandBus.execute(
      new CreateParishCommand(createParishDto, user.userId),
    );

    return parish.props;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing parish' })
  @ApiParam({ name: 'id', description: 'The ID of the parish to update', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The parish has been successfully updated.',
    type: ParishDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('id') id: number,
    @Body() updateParishDto: UpdateParishDto,
    @CurrentUser() user: { userId: number },
  ): Promise<ParishDto> {
    const parish = await this.commandBus.execute(
      new UpdateParishCommand(id, updateParishDto, user.userId),
    );

    return parish.props;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a parish' })
  @ApiParam({ name: 'id', description: 'The ID of the parish to delete', type: Number })
  @ApiResponse({ status: 204, description: 'The parish has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async delete(@Param('id') id: number): Promise<void> {
    await this.commandBus.execute(new DeleteParishCommand(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a parish by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the parish to retrieve', type: Number })
  @ApiResponse({ status: 200, description: 'The parish details.', type: ParishDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async getById(@Param('id') id: number): Promise<ParishDto> {
    const parish = await this.queryBus.execute(new GetParishByIdQuery(id));

    return parish.props;
  }

  @Get()
  @ApiOperation({ summary: 'Get all parishes with pagination and search' })
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
    description: 'Search term for parish name, address, town, LGA, or state',
    example: 'St. Peter',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order (e.g., name:asc, createdAt:desc)',
    example: 'name:asc',
  })
  @ApiResponse({ status: 200, description: 'A list of parishes.', type: [ParishDto] })
  async getAll(@Query() getParishesDto: GetParishesDto): Promise<ParishDto[]> {
    const parishes = await this.queryBus.execute(new GetParishesQuery(getParishesDto));

    return parishes.map(parish => parish.props);
  }
}
