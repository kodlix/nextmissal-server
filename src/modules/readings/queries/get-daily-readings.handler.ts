import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDailyReadingsQuery } from './get-daily-readings.query';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';

@QueryHandler(GetDailyReadingsQuery)
export class GetDailyReadingsHandler implements IQueryHandler<GetDailyReadingsQuery> {
  constructor(private readonly httpService: HttpService) {}

  async execute(query: GetDailyReadingsQuery) {
    const url = `https://www.catholic.org/api/bible/daily_reading.php?date=${query.date}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url).pipe(map(res => res.data)));

      console.warn('Daily readings response:', response);

      return {
        date: query.date,
        readings: response.readings.map(reading => ({
          type: reading.type,
          book: reading.book,
          chapter: reading.chapter,
          verses: reading.verses,
          text: reading.text,
        })),
      };
    } catch (error) {
      console.error('Error fetching daily readings:', error);
      throw new Error('Could not retrieve daily readings.');
    }
  }
}
