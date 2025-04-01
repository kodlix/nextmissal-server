import { v4 as uuidv4 } from 'uuid';
import { ResourceAction } from '@core/value-objects/resource-action.vo';
import { PermissionName } from '@core/value-objects/permission-name.vo';

export class Permission {
  id: string;
  name: PermissionName;
  description: string;
  resourceAction: ResourceAction;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    resourceAction: ResourceAction,
    description: string,
    id?: string
  ) {
    this.id = id || uuidv4();
    this.name = PermissionName.create(
      resourceAction.getResource(), 
      resourceAction.getAction().toString()
    );
    this.description = description;
    this.resourceAction = resourceAction;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  getResource(): string {
    return this.resourceAction.getResource();
  }

  getAction(): string {
    return this.resourceAction.getAction().toString();
  }

  getPermissionName(): string {
    return this.name.getValue();
  }
  
  /**
   * Get the permission name string value for use in tokens and other string contexts
   */
  getStringName(): string {
    return this.name.getValue();
  }
}