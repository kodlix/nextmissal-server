import { EntityId } from './entity-id.vo';

export class UserId extends EntityId {
  private constructor(value: bigint) {
    super(value);
  }

  static create(value?: bigint): UserId {
    return new UserId(value || BigInt(Date.now()));
  }

  static fromString(value: bigint): UserId {
    return new UserId(BigInt(value));
  }
}
