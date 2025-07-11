import { ApiProperty } from '@nestjs/swagger';

export class Paginated<T> {
  @ApiProperty({
    description: 'Array of items for the current page',
    isArray: true,
    type: () => Object, // This will be overridden by the specific DTO type
  })
  readonly items: T[];

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 100,
  })
  readonly total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  readonly page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  readonly limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  readonly totalPages: number;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
