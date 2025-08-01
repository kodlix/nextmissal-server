import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetDailyReadingsQuery } from './queries/get-daily-readings.query';
import { Public } from '@shared/decorators/public.decorator';

@ApiTags('Readings')
@Controller('readings')
@Public()
export class ReadingsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':date')
  @ApiOperation({ summary: 'Get daily readings for a specific date' })
  @ApiParam({
    name: 'date',
    description: 'Date in YYYY-MM-DD format. Optional, defaults to current UTC date.',
    example: '2025-07-25',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Daily readings retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid date format.' })
  async getDailyReadings(@Param('date') date?: string) {
    let targetDate = date;
    if (!targetDate) {
      const today = new Date();
      targetDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    return this.queryBus.execute(new GetDailyReadingsQuery(targetDate));
  }
}
