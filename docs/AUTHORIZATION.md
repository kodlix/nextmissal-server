# Authorization System

This document explains the authorization system implemented in the application, which combines role-based and permission-based access control.

## Overview

The authorization system provides two levels of access control:

1. **Role-based Access Control (RBAC)**: Controls access based on user roles (e.g., 'admin', 'user')
2. **Permission-based Access Control**: Fine-grained control based on specific permissions (e.g., 'user:read', 'role:write')

Both mechanisms are integrated with database entities, allowing for dynamic assignment and revocation of roles and permissions.

## Core Components

### 1. Guards

- **AuthGuard**: The main guard that handles both role and permission checking
- **RolesGuard**: A compatibility wrapper around AuthGuard for role-based checks
- **PermissionsGuard**: A semantic wrapper around AuthGuard for permission-based checks

### 2. Decorators

#### Role Decorators
```typescript
@Roles(RolesEnum.ADMIN)
```

#### Permission Decorators
```typescript
@RequirePermissions('user:read', 'user:write')
```

#### Resource-based Permission Helpers
```typescript
@CanRead('user')    // Equivalent to @RequirePermissions('user:read')
@CanWrite('role')   // Equivalent to @RequirePermissions('role:write')
@CanDelete('user')  // Equivalent to @RequirePermissions('user:delete')
```

## How It Works

1. When a user logs in, their roles are retrieved from the database
2. Permissions associated with those roles are also retrieved
3. The JWT token includes both roles and permissions
4. Guards use the JWT payload to check access rules
5. Controllers and routes can specify required roles or permissions using decorators

## Database Schema

The following database tables are used:

- `User`: Stores user information
- `Role`: Defines available roles
- `Permission`: Defines available permissions
- `UserRole`: Maps users to roles (many-to-many)
- `RolePermission`: Maps roles to permissions (many-to-many)

## Usage Examples

### Protecting a Controller with Role-based Access

```typescript
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(RolesEnum.ADMIN)
export class AdminController {
  // Only admins can access these endpoints
}
```

### Protecting a Controller with Permission-based Access

```typescript
@Controller('roles')
@UseGuards(PermissionsGuard)
@RequirePermissions('role:read')
export class RoleController {
  // All methods require 'role:read' permission
  
  @Post()
  @CanWrite('role')  // Additionally requires 'role:write' permission
  createRole() {
    // Implementation
  }
  
  @Delete(':id')
  @CanDelete('role')  // Additionally requires 'role:delete' permission
  deleteRole() {
    // Implementation
  }
}
```

### Using Resource Permissions

The following resource permission helpers are available:

- `@CanRead(resource)`: Requires '{resource}:read' permission
- `@CanWrite(resource)`: Requires '{resource}:write' permission
- `@CanDelete(resource)`: Requires '{resource}:delete' permission
- `@ResourcePermissions(resource, actions)`: Requires multiple permissions for a resource
- `@FullResourceAccess(resource)`: Requires read, write, and delete permissions for a resource

## Best Practices

1. Use permission-based access control for fine-grained authorization
2. Use role-based access control for broad categories of users
3. Combine both approaches as needed
4. Prefer the resource permission helpers for cleaner code
5. Always run database seeds to create the default roles and permissions
6. Assign appropriate permissions to roles during seed creation

## Default Roles and Permissions

The system comes with the following defaults:

**Roles**:
- `admin`: Administrator role with full access
- `user`: Default user role with limited access

**Permissions**:
- `user:read`: Can read user information
- `user:write`: Can create and update user information
- `user:delete`: Can delete users
- `role:read`: Can read role information
- `role:write`: Can create and update roles
- `role:delete`: Can delete roles

## Adding New Permissions

To add new permissions:

1. Update the seed file (`prisma/seed.ts`) to include the new permission
2. Run the seed command: `npm run db:seed`
3. Assign the permission to the appropriate roles
4. Use the permission in controllers or routes with appropriate decorators