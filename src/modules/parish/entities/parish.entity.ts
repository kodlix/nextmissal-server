import { AggregateRoot } from '@nestjs/cqrs';

export interface IParishProps {
  id: number;
  name: string;
  profile?: string;
  email?: string;
  telephone?: string;
  slogan?: string;
  address: string;
  town: string;
  lga?: string;
  state: string;
  postOfficeAddress?: string;
  website?: string;
  logo?: string;
  vision?: string;
  mission?: string;
  establishedOn?: Date;
  active: boolean;
  isStation: boolean;
  parentParishId?: number;
  denaryId?: number;
  parishPriest?: string;
  assistantPriest1?: string;
  assistantPriest2?: string;
  parishPriestPhoneNumber?: string;
  assistantPriest1PhoneNumber?: string;
  assistantPriest2PhoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}

export class Parish extends AggregateRoot {
  private constructor(private readonly props: IParishProps) {
    super();
  }

  static create(props: Omit<IParishProps, 'id' | 'createdAt' | 'updatedAt'>, id?: number): Parish {
    return new Parish({
      id: id || 0, // ID will be set by the database on creation
      createdAt: new Date(),
      updatedAt: new Date(),
      ...props,
    });
  }

  static fromData(props: IParishProps): Parish {
    return new Parish(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get profile(): string | undefined {
    return this.props.profile;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get telephone(): string | undefined {
    return this.props.telephone;
  }

  get slogan(): string | undefined {
    return this.props.slogan;
  }

  get address(): string {
    return this.props.address;
  }

  get town(): string {
    return this.props.town;
  }

  get lga(): string | undefined {
    return this.props.lga;
  }

  get state(): string {
    return this.props.state;
  }

  get postOfficeAddress(): string | undefined {
    return this.props.postOfficeAddress;
  }

  get website(): string | undefined {
    return this.props.website;
  }

  get logo(): string | undefined {
    return this.props.logo;
  }

  get vision(): string | undefined {
    return this.props.vision;
  }

  get mission(): string | undefined {
    return this.props.mission;
  }

  get establishedOn(): Date | undefined {
    return this.props.establishedOn;
  }

  get active(): boolean {
    return this.props.active;
  }

  get isStation(): boolean {
    return this.props.isStation;
  }

  get parentParishId(): number | undefined {
    return this.props.parentParishId;
  }

  get denaryId(): number | undefined {
    return this.props.denaryId;
  }

  get parishPriest(): string | undefined {
    return this.props.parishPriest;
  }

  get assistantPriest1(): string | undefined {
    return this.props.assistantPriest1;
  }

  get assistantPriest2(): string | undefined {
    return this.props.assistantPriest2;
  }

  get parishPriestPhoneNumber(): string | undefined {
    return this.props.parishPriestPhoneNumber;
  }

  get assistantPriest1PhoneNumber(): string | undefined {
    return this.props.assistantPriest1PhoneNumber;
  }

  get assistantPriest2PhoneNumber(): string | undefined {
    return this.props.assistantPriest2PhoneNumber;
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

  updateEmail(email: string): void {
    this.props.email = email;
    this.props.updatedAt = new Date();
  }

  updateTelephone(telephone: string): void {
    this.props.telephone = telephone;
    this.props.updatedAt = new Date();
  }

  updateSlogan(slogan: string): void {
    this.props.slogan = slogan;
    this.props.updatedAt = new Date();
  }

  updateAddress(address: string): void {
    this.props.address = address;
    this.props.updatedAt = new Date();
  }

  updateTown(town: string): void {
    this.props.town = town;
    this.props.updatedAt = new Date();
  }

  updateLga(lga: string): void {
    this.props.lga = lga;
    this.props.updatedAt = new Date();
  }

  updateState(state: string): void {
    this.props.state = state;
    this.props.updatedAt = new Date();
  }

  updatePostOfficeAddress(postOfficeAddress: string): void {
    this.props.postOfficeAddress = postOfficeAddress;
    this.props.updatedAt = new Date();
  }

  updateWebsite(website: string): void {
    this.props.website = website;
    this.props.updatedAt = new Date();
  }

  updateLogo(logo: string): void {
    this.props.logo = logo;
    this.props.updatedAt = new Date();
  }

  updateVision(vision: string): void {
    this.props.vision = vision;
    this.props.updatedAt = new Date();
  }

  updateMission(mission: string): void {
    this.props.mission = mission;
    this.props.updatedAt = new Date();
  }

  updateEstablishedOn(establishedOn: Date): void {
    this.props.establishedOn = establishedOn;
    this.props.updatedAt = new Date();
  }

  updateActive(active: boolean): void {
    this.props.active = active;
    this.props.updatedAt = new Date();
  }

  updateIsStation(isStation: boolean): void {
    this.props.isStation = isStation;
    this.props.updatedAt = new Date();
  }

  updateParentParishId(parentParishId: number): void {
    this.props.parentParishId = parentParishId;
    this.props.updatedAt = new Date();
  }

  updateDenaryId(denaryId: number): void {
    this.props.denaryId = denaryId;
    this.props.updatedAt = new Date();
  }

  updateParishPriest(parishPriest: string): void {
    this.props.parishPriest = parishPriest;
    this.props.updatedAt = new Date();
  }

  updateAssistantPriest1(assistantPriest1: string): void {
    this.props.assistantPriest1 = assistantPriest1;
    this.props.updatedAt = new Date();
  }

  updateAssistantPriest2(assistantPriest2: string): void {
    this.props.assistantPriest2 = assistantPriest2;
    this.props.updatedAt = new Date();
  }

  updateParishPriestPhoneNumber(parishPriestPhoneNumber: string): void {
    this.props.parishPriestPhoneNumber = parishPriestPhoneNumber;
    this.props.updatedAt = new Date();
  }

  updateAssistantPriest1PhoneNumber(assistantPriest1PhoneNumber: string): void {
    this.props.assistantPriest1PhoneNumber = assistantPriest1PhoneNumber;
    this.props.updatedAt = new Date();
  }

  updateAssistantPriest2PhoneNumber(assistantPriest2PhoneNumber: string): void {
    this.props.assistantPriest2PhoneNumber = assistantPriest2PhoneNumber;
    this.props.updatedAt = new Date();
  }

  updateUpdatedBy(updatedBy: number): void {
    this.props.updatedBy = updatedBy;
    this.props.updatedAt = new Date();
  }
}
