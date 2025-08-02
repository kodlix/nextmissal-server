import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

import { CreateComplaintDto } from './dto/create-complaint.dto';
import { CreateComplaintCommand } from './commands/create-complaint.command';

import { GetComplaintsQuery } from './queries/get-complaints.query';
import { GetComplaintByIdQuery } from './queries/get-complaint-by-id.query';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { UpdateComplaintCommand } from './commands/update-complaint.command';

@ApiTags('Compliance')
@Controller('compliance')
export class ComplianceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({
    status: 201,
    description: 'The report has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createComplaintDto: CreateComplaintDto,
    @CurrentUser() user: { id: bigint },
  ) {
    return this.commandBus.execute(new CreateComplaintCommand(createComplaintDto, user.id));
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: 200, description: 'A list of reports.' })
  async findAll() {
    return this.queryBus.execute(new GetComplaintsQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiResponse({ status: 200, description: 'The report details.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async findById(@Param('id') id: number) {
    return this.queryBus.execute(new GetComplaintByIdQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a complaint' })
  @ApiResponse({ status: 200, description: 'The complaint has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async update(@Param('id') id: number, @Body() updateComplaintDto: UpdateComplaintDto) {
    return this.commandBus.execute(new UpdateComplaintCommand(id, updateComplaintDto));
  }
}
