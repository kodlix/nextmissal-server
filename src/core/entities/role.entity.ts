import { v4 as uuidv4 } from 'uuid';
import { Permission } from './permission.entity';

export class Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, description: string, isDefault: boolean = false) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.permissions = [];
    this.isDefault = isDefault;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addPermission(permission: Permission): void {
    if (!this.permissions.some(p => p.id === permission.id)) {
      this.permissions.push(permission);
      this.updatedAt = new Date();
    }
  }

  removePermission(permissionId: string): void {
    this.permissions = this.permissions.filter(p => p.id !== permissionId);
    this.updatedAt = new Date();
  }

  setDefault(isDefault: boolean): void {
    this.isDefault = isDefault;
    this.updatedAt = new Date();
  }
}
