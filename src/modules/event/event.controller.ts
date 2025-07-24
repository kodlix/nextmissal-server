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
import { CreateEventCommand } from './commands/create-event.command';
import { UpdateEventCommand } from './commands/update-event.command';
import { DeleteEventCommand } from './commands/delete-event.command';
import { GetEventByIdQuery } from './queries/get-event-by-id.query';
import { GetEventsQuery } from './queries/get-events.query';
import { RegisterEventAttendeeCommand } from './commands/register-event-attendee.command';
import { GetEventAttendeesQuery } from './queries/get-event-attendees.query';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { EventDto } from './dtos/event.dto';
import { GetEventsDto } from './dtos/get-events.dto';
import { RegisterEventAttendeeDto } from './dtos/register-event-attendee.dto';
import { EventAttendeeDto } from './dtos/event-attendee.dto';
import { GetEventAttendeesDto } from './dtos/get-event-attendees.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

@ApiTags('Event')
@Controller('events')
export class EventController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    type: EventDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: { id: number },
  ): Promise<EventDto> {
    const event = await this.commandBus.execute(new CreateEventCommand(createEventDto, user.id));

    return event.props;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing event' })
  @ApiParam({ name: 'id', description: 'The ID of the event to update', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully updated.',
    type: EventDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: { id: number },
  ): Promise<EventDto> {
    const event = await this.commandBus.execute(
      new UpdateEventCommand(id, updateEventDto, user.id),
    );

    return event.props;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an event' })
  @ApiParam({ name: 'id', description: 'The ID of the event to delete', type: Number })
  @ApiResponse({ status: 204, description: 'The event has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async delete(@Param('id') id: number): Promise<void> {
    await this.commandBus.execute(new DeleteEventCommand(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an event by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the event to retrieve', type: Number })
  @ApiResponse({ status: 200, description: 'The event details.', type: EventDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async getById(@Param('id') id: number): Promise<EventDto> {
    const event = await this.queryBus.execute(new GetEventByIdQuery(id));

    return event.props;
  }

  @Get()
  @ApiOperation({ summary: 'Get all events with pagination and search' })
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
    description: 'Search term for event name or description',
    example: 'Harvest',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order (e.g., name:asc, createdAt:desc)',
    example: 'name:asc',
  })
  @ApiQuery({
    name: 'isPublic',
    required: false,
    type: Boolean,
    description: 'Filter by public status',
    example: true,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Filter by start date (ISO 8601 format)',
    example: '2023-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Filter by end date (ISO 8601 format)',
    example: '2023-12-31T23:59:59Z',
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
  @ApiResponse({ status: 200, description: 'A list of events.', type: [EventDto] })
  async getAll(@Query() getEventsDto: GetEventsDto): Promise<EventDto[]> {
    const events = await this.queryBus.execute(new GetEventsQuery(getEventsDto));

    return events.map(event => event.props);
  }

  @Post(':eventId/register')
  @ApiOperation({ summary: 'Register a user for an event' })
  @ApiParam({ name: 'eventId', description: 'The ID of the event to register for', type: Number })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered for the event.',
    type: EventAttendeeDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async registerForEvent(
    @Param('eventId') eventId: number,
    @Body() registerEventAttendeeDto: RegisterEventAttendeeDto,
    @CurrentUser() user: { id: number },
  ): Promise<EventAttendeeDto> {
    registerEventAttendeeDto.eventId = Number(eventId);
    const eventAttendee = await this.commandBus.execute(
      new RegisterEventAttendeeCommand(registerEventAttendeeDto, BigInt(user.id)),
    );

    return eventAttendee.props;
  }

  @Get(':eventId/attendees')
  @ApiOperation({ summary: 'Get all attendees for an event with pagination and search' })
  @ApiParam({ name: 'eventId', description: 'The ID of the event', type: Number })
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
    description: 'Search term for attendee name or email',
    example: 'John Doe',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order (e.g., createdAt:desc)',
    example: 'createdAt:desc',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by attendance status (REGISTERED, CHECKED_IN, CANCELLED)',
    example: 'REGISTERED',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description: 'Filter by user ID',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'A list of event attendees.', type: [EventAttendeeDto] })
  async getEventAttendees(
    @Param('eventId') eventId: number,
    @Query() getEventAttendeesDto: GetEventAttendeesDto,
  ): Promise<EventAttendeeDto[]> {
    const attendees = await this.queryBus.execute(
      new GetEventAttendeesQuery(Number(eventId), getEventAttendeesDto),
    );

    return attendees.map(attendee => attendee.props);
  }
}
