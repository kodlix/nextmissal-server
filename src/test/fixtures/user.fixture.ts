import { User } from '@core/entities/user.entity';
import { Role } from '@core/entities/role.entity';
import { Email } from '@core/value-objects/email.vo';
import { FirstName, LastName } from '@core/value-objects/name.vo';

export const userFixtures = {
  users: {
    validUser: (): User => {
      const user = new User(
        new Email('test@example.com'),
        'hashedPassword', // Hashed password
        new FirstName('John'),
        new LastName('Doe'),
        '550e8400-e29b-41d4-a716-446655440000'
      );
      return user;
    },
    
    inactiveUser: (): User => {
      const user = userFixtures.users.validUser();
      user.deactivate();
      return user;
    },
    
    userWithRoles: (): User => {
      const user = userFixtures.users.validUser();
      const role = userFixtures.roles.userRole();
      user.addRole(role);
      return user;
    }
  },
  
  roles: {
    userRole: (): Role => {
      return {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'user',
        description: 'Regular user role',
        isDefault: true,
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      } as Role;
    },
    
    adminRole: (): Role => {
      return {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'admin',
        description: 'Administrator role',
        isDefault: false,
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      } as Role;
    }
  }
};