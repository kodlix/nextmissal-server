import { Logger } from '@nestjs/common';

/**
 * Base repository class with common error handling
 */
export abstract class BaseRepository<T> {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * Handle repository errors
   */
  protected handleError(operation: string, error: Error, returnValue: any = null): any {
    this.logger.error(`Error in ${operation}: ${error.message}`, error.stack);
    return returnValue;
  }

  /**
   * Execute a database operation with error handling
   */
  protected async executeWithErrorHandling<R>(
    operation: string,
    action: () => Promise<R>,
    fallbackValue?: R
  ): Promise<R> {
    try {
      return await action();
    } catch (error) {
      return this.handleError(operation, error, fallbackValue);
    }
  }
}