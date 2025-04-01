# Database Migrations and Seeds

This directory contains the database migrations and seed data for the application.

## Migrations

Migrations are managed using Prisma Migrate. The initial migration creates all the required tables for the application.

### Running Migrations

To run migrations and update your database schema:

```bash
# Apply migrations to the database
npm run db:migrate

# Or to just push the schema without migrations
npm run db:push
```

## Seeds

Seeds provide initial data for the database, including:

1. Default roles (`admin` and `user`)
2. Default permissions (read, write, delete for user and role resources)
3. Admin user with credentials:
   - Email: admin@example.com
   - Password: Admin@123

### Running Seeds

To seed your database with initial data:

```bash
# Seed the database
npm run db:seed
```

This will create the default roles, permissions, and admin user if they don't already exist.

## Default Admin Credentials

After running the seed script, you can login with:
- **Email**: admin@example.com
- **Password**: Admin@123

**Note**: In a production environment, you should change these default credentials immediately after deployment.