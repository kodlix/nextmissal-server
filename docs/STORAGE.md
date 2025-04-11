# Storage Module

The Storage Module provides a flexible solution for file storage in the NestJS Template. It's built on Domain-Driven Design principles and supports multiple storage providers, including:

- MinIO for local development
- AWS S3 for production environments
- Other S3-compatible storage providers

## Features

- Upload files with automatic categorization (public/private)
- Secure access control based on file ownership
- File metadata tracking in the database
- Signed URLs for secure access to private files
- Public URLs for publicly accessible files
- Integration with the permissions system

## Configuration

Storage configuration is managed through environment variables. The default storage provider is MinIO for local development.

### MinIO Configuration (Local Development)

```env
STORAGE_DRIVER=minio
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_REGION=us-east-1
MINIO_PUBLIC_BUCKET=public
MINIO_PRIVATE_BUCKET=private
FILE_STORAGE_PUBLIC_URL=http://localhost:9000
```

### AWS S3 Configuration (Production)

```env
STORAGE_DRIVER=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_PUBLIC_BUCKET=your-public-bucket
AWS_PRIVATE_BUCKET=your-private-bucket
FILE_STORAGE_PUBLIC_URL=https://your-public-bucket.s3.amazonaws.com
```

## Docker Support

The project includes Docker Compose configuration for MinIO:

```bash
docker-compose up -d minio createbuckets
```

This will start MinIO on port 9000 and the MinIO Console on port 9001. It will also create the necessary buckets:

- `public` - For publicly accessible files (accessible without authentication)
- `private` - For private files (requires signed URLs)

## API Endpoints

| Method | Endpoint               | Description                 | Authentication | Permission      |
|--------|------------------------|-----------------------------|----------------|-----------------|
| POST   | /storage/upload        | Upload a file               | Required       | storage:upload  |
| GET    | /storage/:id           | Get file by ID              | Required       | -               |
| GET    | /storage/user/files    | Get user's files            | Required       | storage:read    |
| DELETE | /storage/:id           | Delete a file               | Required       | storage:delete  |
| PATCH  | /storage/access        | Update file access          | Required       | storage:update  |

## Usage Examples

### Uploading a File

```typescript
// Using Fetch API
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/storage/upload', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Getting a File

```typescript
fetch(`/storage/${fileId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => {
  // data.url contains the URL to access the file
  const fileUrl = data.url;
});
```

## Architecture

The Storage module follows Domain-Driven Design principles:

### Core Domain

- `File` entity - Represents a file in the system
- `IFileRepository` interface - Repository interface for file storage
- `StorageService` - Domain service for file operations

### Infrastructure

- `FileRepository` - Implements the repository interface using Prisma
- `MinioStorageProvider` - Implements storage using MinIO
- `S3StorageProvider` - Implements storage using AWS S3

### Application Layer

- Commands for manipulating files (upload, delete, update)
- Queries for retrieving files and file information
- DTOs for request/response data transfer

### Presentation Layer

- `StorageController` - API endpoints for file operations
- Integration with the CQRS pattern and the permissions system

## Security Considerations

- Files are stored securely based on their classification (public/private)
- Access control is enforced at the API level
- Private files require a signed URL with limited validity time
- File ownership is tracked to prevent unauthorized access
- File uploads are restricted by type and size

## Performance

- Files are stored in object storage for high performance and scalability
- File metadata is stored in the database for quick queries
- Signed URLs provide direct access to the storage backend, reducing server load