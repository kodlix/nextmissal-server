import { ResourceAction } from '@core/value-objects/resource-action.vo';
import { PermissionName } from '@core/value-objects/permission-name.vo';
import { InvalidValueObjectException } from '@core/exceptions/domain-exceptions';

export class Permission {
  private readonly _id: bigint | undefined;
  private readonly _name: PermissionName;
  private _description: string;
  private readonly _resourceAction: ResourceAction;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: bigint | undefined,
    resourceAction: ResourceAction,
    description: string,
    createdAt?: Date,
  ) {
    this.validateDescription(description);

    this._name = PermissionName.create(
      resourceAction.getResource(),
      resourceAction.getAction().toString(),
    );
    this._description = description;
    this._resourceAction = resourceAction;
    this._createdAt = createdAt || new Date();
    this._updatedAt = new Date();
  }

  // Factory method for creating new permissions
  static create(resourceAction: ResourceAction, description: string): Permission {
    return new Permission(undefined, resourceAction, description);
  }

  // Factory method for reconstituting from persistence
  static fromData(data: {
    id?: bigint;
    resourceAction: ResourceAction;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }): Permission {
    const permission = new Permission(
      data.id,
      data.resourceAction,
      data.description,
      data.createdAt,
    );

    permission._updatedAt = data.updatedAt;

    return permission;
  }

  // Getters
  get id(): bigint {
    return this._id;
  }

  get name(): PermissionName {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get resourceAction(): ResourceAction {
    return this._resourceAction;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  updateDescription(newDescription: string): void {
    this.validateDescription(newDescription);

    if (this._description === newDescription) {
      return; // No change needed
    }

    this._description = newDescription;
    this._updatedAt = new Date();
  }

  // Query methods
  getResource(): string {
    return this._resourceAction.getResource();
  }

  getAction(): string {
    return this._resourceAction.getAction().toString();
  }

  getPermissionName(): string {
    return this._name.getValue();
  }

  /**
   * Get the permission name string value for use in tokens and other string contexts
   */
  getStringName(): string {
    return this._name.getValue();
  }

  // Check if this permission allows a specific action on a resource
  allowsAction(resource: string, action: string): boolean {
    return this.getResource() === resource && this.getAction() === action;
  }

  // Private validation methods
  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new InvalidValueObjectException('Permission description cannot be empty');
    }

    if (description.length > 500) {
      throw new InvalidValueObjectException('Permission description cannot exceed 500 characters');
    }
  }
}
