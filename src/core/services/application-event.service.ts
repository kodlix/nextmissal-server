import { Injectable } from '@nestjs/common';
import { LoggerService } from '@core/logger/logger.service';

/**
 * Application Event Service that registers domain event handlers
 * This demonstrates how to use the DomainEventService in practice
 */
@Injectable()
export class ApplicationEventService {
  constructor(private readonly logger: LoggerService) {}
}
