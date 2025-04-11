import { v4 as uuidv4 } from 'uuid';
import { InvalidValueObjectException } from '@core/exceptions/domain-exceptions';

export class UserId {
  private readonly value: string;

  constructor(id: string) {
    if (!this.isValid(id)) {
      throw new InvalidValueObjectException('Invalid user ID format');
    }
    this.value = id;
  }

  private isValid(id: string): boolean {
    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidRegex.test(id);
  }

  getValue(): string {
    return this.value;
  }

  equals(userId: UserId): boolean {
    return this.value === userId.getValue();
  }

  static generate(): UserId {
    return new UserId(uuidv4());
  }
}
