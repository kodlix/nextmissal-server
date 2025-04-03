import { Logger } from '@nestjs/common';

/**
 * Base repository class with common error handling
 */
export abstract class BaseRepository {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * Handle repository errors
   * @param operation - The name of the operation that failed
   * @param error - The error that occurred
   * @param returnValue - Optional fallback value to return
   * @returns The fallback value
   */
  protected handleError<T>(
    operation: string,
    error: unknown,
    returnValue: T | null = null,
  ): T | null {
    if (error instanceof Error) {
      this.logger.error(`Error in ${operation}: ${error.message}`, error.stack);
    } else {
      this.logger.error(`Error in ${operation}: ${String(error)}`);
    }
    return returnValue;
  }

  /**
   * Execute a database operation with error handling
   * @param operation - The name of the operation to perform
   * @param action - The async function to execute
   * @param fallbackValue - Optional fallback value to return on error
   * @returns The result of the action or the fallback value on error
   */
  protected async executeWithErrorHandling<R>(
    operation: string,
    action: () => Promise<R>,
    fallbackValue?: R,
  ): Promise<R | undefined> {
    try {
      return await action();
    } catch (error) {
      return this.handleError<R>(operation, error, fallbackValue);
    }
  }
}
