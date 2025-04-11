import { AggregateRoot } from '@nestjs/cqrs';

export class File extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _filename: string,
    private readonly _originalName: string,
    private readonly _path: string,
    private readonly _mimeType: string,
    private readonly _size: number,
    private readonly _bucket: string,
    private readonly _userId: string | null,
    private _isPublic: boolean,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  get id(): string {
    return this._id;
  }

  get filename(): string {
    return this._filename;
  }

  get originalName(): string {
    return this._originalName;
  }

  get path(): string {
    return this._path;
  }

  get mimeType(): string {
    return this._mimeType;
  }

  get size(): number {
    return this._size;
  }

  get bucket(): string {
    return this._bucket;
  }

  get userId(): string | null {
    return this._userId;
  }

  get isPublic(): boolean {
    return this._isPublic;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  makePublic(): void {
    this._isPublic = true;
    this._updatedAt = new Date();
  }

  makePrivate(): void {
    this._isPublic = false;
    this._updatedAt = new Date();
  }
}
