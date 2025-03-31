import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IRoleRepository } from '../repositories/role.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const passwordHash = await this.hashPassword(password);

    // Create a new user
    const user = new User(email, passwordHash, firstName, lastName);

    // Assign default role
    const defaultRole = await this.roleRepository.findDefaultRole();
    if (defaultRole) {
      user.addRole(defaultRole);
    }

    // Save the user
    return this.userRepository.create(user);
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await this.comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async updateUserDetails(
    userId: string,
    firstName?: string,
    lastName?: string,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    user.updatedAt = new Date();
    return this.userRepository.update(user);
  }

  async changePassword(userId: string, newPassword: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.passwordHash = await this.hashPassword(newPassword);
    user.updatedAt = new Date();
    return this.userRepository.update(user);
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    user.addRole(role);
    return this.userRepository.update(user);
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.removeRole(roleId);
    return this.userRepository.update(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}