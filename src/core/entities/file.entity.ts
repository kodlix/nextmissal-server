import { v4 as uuidv4 } from 'uuid';

export class File {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  bucket: string;
  userId: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    filename: string,
    originalName: string,
    path: string,
    mimeType: string,
    size: number,
    bucket: string,
    userId: string | null = null,
    isPublic: boolean = false,
    id?: string,
  ) {
    this.id = id || uuidv4();
    this.filename = filename;
    this.originalName = originalName;
    this.path = path;
    this.mimeType = mimeType;
    this.size = size;
    this.bucket = bucket;
    this.userId = userId;
    this.isPublic = isPublic;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  makePublic(): void {
    if (!this.isPublic) {
      this.isPublic = true;
      this.updatedAt = new Date();
    }
  }

  makePrivate(): void {
    if (this.isPublic) {
      this.isPublic = false;
      this.updatedAt = new Date();
    }
  }

  updateUser(userId: string | null): void {
    this.userId = userId;
    this.updatedAt = new Date();
  }

  rename(newOriginalName: string): void {
    this.originalName = newOriginalName;
    this.updatedAt = new Date();
  }

  move(newPath: string, newBucket?: string): void {
    this.path = newPath;
    if (newBucket) {
      this.bucket = newBucket;
    }
    this.updatedAt = new Date();
  }

  static fromData(data: {
    id: string;
    filename: string;
    originalName: string;
    path: string;
    mimeType: string;
    size: number;
    bucket: string;
    userId: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): File {
    const file = new File(
      data.filename,
      data.originalName,
      data.path,
      data.mimeType,
      data.size,
      data.bucket,
      data.userId,
      data.isPublic,
      data.id,
    );
    file.createdAt = new Date(data.createdAt);
    file.updatedAt = new Date(data.updatedAt);

    return file;
  }
}
