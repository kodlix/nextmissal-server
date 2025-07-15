import { AggregateRoot } from '@nestjs/cqrs';

export interface IDenaryProps {
  id: number;
  name: string;
  dean: string;
  address: string;
  dioceseId: number;
  profile: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}

export class Denary extends AggregateRoot {
  private constructor(private readonly props: IDenaryProps) {
    super();
  }

  static create(props: Omit<IDenaryProps, 'id' | 'createdAt' | 'updatedAt'>, id?: number): Denary {
    return new Denary({
      id: id || 0, // ID will be set by the database on creation
      createdAt: new Date(),
      updatedAt: new Date(),
      ...props,
    });
  }

  static fromData(props: IDenaryProps): Denary {
    return new Denary(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get dean(): string {
    return this.props.dean;
  }

  get address(): string {
    return this.props.address;
  }

  get dioceseId(): number {
    return this.props.dioceseId;
  }

  get profile(): string {
    return this.props.profile;
  }

  get active(): boolean {
    return this.props.active;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get createdBy(): number | undefined {
    return this.props.createdBy;
  }

  get updatedBy(): number | undefined {
    return this.props.updatedBy;
  }

  updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateDean(dean: string): void {
    this.props.dean = dean;
    this.props.updatedAt = new Date();
  }

  updateAddress(address: string): void {
    this.props.address = address;
    this.props.updatedAt = new Date();
  }

  updateDioceseId(dioceseId: number): void {
    this.props.dioceseId = dioceseId;
    this.props.updatedAt = new Date();
  }

  updateProfile(profile: string): void {
    this.props.profile = profile;
    this.props.updatedAt = new Date();
  }

  updateActive(active: boolean): void {
    this.props.active = active;
    this.props.updatedAt = new Date();
  }

  updateUpdatedBy(updatedBy: number): void {
    this.props.updatedBy = updatedBy;
    this.props.updatedAt = new Date();
  }
}
