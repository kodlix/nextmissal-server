import { EntityId } from './entity-id.vo';

export class PermissionId extends EntityId {
  private constructor(value: bigint) {
    super(value);
  }

  static create(value?: bigint): PermissionId {
    return new PermissionId(value);
  }

  static fromString(value: bigint): PermissionId {
    return new PermissionId(value);
  }
}
