export class FileResponseDto {
  id!: string;
  filename!: string;
  originalName!: string;
  mimeType!: string;
  size!: number;
  isPublic!: boolean;
  url!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<FileResponseDto>) {
    Object.assign(this, partial);
  }
}
