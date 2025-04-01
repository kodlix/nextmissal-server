import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Roles
const roles = [
  {
    name: 'admin',
    description: 'Administrator role with full access',
    isDefault: false,
  },
  {
    name: 'user',
    description: 'Default user role with limited access',
    isDefault: true,
  },
];

// Permissions
const permissions = [
  {
    name: 'user:read',
    description: 'Can read user information',
    resource: 'user',
    action: 'read',
  },
  {
    name: 'user:write',
    description: 'Can create and update user information',
    resource: 'user',
    action: 'write',
  },
  {
    name: 'user:delete',
    description: 'Can delete users',
    resource: 'user',
    action: 'delete',
  },
  {
    name: 'role:read',
    description: 'Can read role information',
    resource: 'role',
    action: 'read',
  },
  {
    name: 'role:write',
    description: 'Can create and update roles',
    resource: 'role',
    action: 'write',
  },
  {
    name: 'role:delete',
    description: 'Can delete roles',
    resource: 'role',
    action: 'delete',
  },
];

// Map of role names to permissions they should have
const rolePermissionsMap = {
  admin: [
    'user:read',
    'user:write',
    'user:delete',
    'role:read',
    'role:write',
    'role:delete',
  ],
  user: ['user:read'],
};

// Default admin user
const adminUser = {
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  password: 'Admin@123', // This will be hashed before saving
};

// Helper function to hash password
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create roles
  console.log('Creating roles...');
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // Create permissions
  console.log('Creating permissions...');
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // Assign permissions to roles
  console.log('Assigning permissions to roles...');
  for (const [roleName, permissionNames] of Object.entries(rolePermissionsMap)) {
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      console.error(`Role ${roleName} not found`);
      continue;
    }

    for (const permissionName of permissionNames) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName },
      });

      if (!permission) {
        console.error(`Permission ${permissionName} not found`);
        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  // Create admin user
  console.log('Creating admin user...');
  const hashedPassword = await hashPassword(adminUser.password);
  
  const user = await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {},
    create: {
      email: adminUser.email,
      passwordHash: hashedPassword,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
    },
  });

  // Assign admin role to admin user
  console.log('Assigning admin role to admin user...');
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  if (adminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: adminRole.id,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });