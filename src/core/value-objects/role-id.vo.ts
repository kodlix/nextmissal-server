import { EntityId } from './entity-id.vo';

export class RoleId extends EntityId {
  private constructor(value: bigint) {
    super(value);
  }

  static create(value?: bigint): RoleId {
    return new RoleId(value);
  }

  static fromString(value: bigint): RoleId {
    return new RoleId(value);
  }
}
