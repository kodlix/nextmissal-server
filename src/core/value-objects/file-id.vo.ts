import { EntityId } from './entity-id.vo';

export class FileId extends EntityId {
  private constructor(value: bigint) {
    super(value);
  }

  static create(value?: bigint): FileId {
    return new FileId(value);
  }

  static fromString(value: bigint): FileId {
    return new FileId(value);
  }
}
