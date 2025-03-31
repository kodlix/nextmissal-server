import { v4 as uuidv4 } from 'uuid';

export class Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    name: string,
    description: string,
    resource: string,
    action: string,
  ) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.resource = resource;
    this.action = action;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}