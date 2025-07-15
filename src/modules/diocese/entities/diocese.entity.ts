import { AggregateRoot } from '@nestjs/cqrs';

export interface IDioceseProps {
  id: number;
  name: string;
  profile: string;
  cathedral?: string;
  address?: string;
  telephones?: string;
  emails?: string;
  province?: string;
  bishop?: string;
  isArchidiocese: boolean;
  countryId: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}

export class Diocese extends AggregateRoot {
  private constructor(private readonly props: IDioceseProps) {
    super();
  }

  static create(props: Omit<DioceseProps, 'id' | 'createdAt' | 'updatedAt'>, id?: number): Diocese {
    return new Diocese({
      id: id || 0, // ID will be set by the database on creation
      createdAt: new Date(),
      updatedAt: new Date(),
      ...props,
    });
  }

  static fromData(props: DioceseProps): Diocese {
    return new Diocese(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get profile(): string {
    return this.props.profile;
  }

  get cathedral(): string | undefined {
    return this.props.cathedral;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get telephones(): string | undefined {
    return this.props.telephones;
  }

  get emails(): string | undefined {
    return this.props.emails;
  }

  get province(): string | undefined {
    return this.props.province;
  }

  get bishop(): string | undefined {
    return this.props.bishop;
  }

  get isArchidiocese(): boolean {
    return this.props.isArchidiocese;
  }

  get countryId(): number {
    return this.props.countryId;
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

  updateProfile(profile: string): void {
    this.props.profile = profile;
    this.props.updatedAt = new Date();
  }

  updateCathedral(cathedral: string): void {
    this.props.cathedral = cathedral;
    this.props.updatedAt = new Date();
  }

  updateAddress(address: string): void {
    this.props.address = address;
    this.props.updatedAt = new Date();
  }

  updateTelephones(telephones: string): void {
    this.props.telephones = telephones;
    this.props.updatedAt = new Date();
  }

  updateEmails(emails: string): void {
    this.props.emails = emails;
    this.props.updatedAt = new Date();
  }

  updateProvince(province: string): void {
    this.props.province = province;
    this.props.updatedAt = new Date();
  }

  updateBishop(bishop: string): void {
    this.props.bishop = bishop;
    this.props.updatedAt = new Date();
  }

  updateIsArchidiocese(isArchidiocese: boolean): void {
    this.props.isArchidiocese = isArchidiocese;
    this.props.updatedAt = new Date();
  }

  updateCountryId(countryId: number): void {
    this.props.countryId = countryId;
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
