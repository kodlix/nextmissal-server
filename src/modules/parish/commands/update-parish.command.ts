import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UpdateParishDto } from '@modules/parish/dtos/update-parish.dto';
import { ParishRepository } from '@modules/parish/repositories/parish.repository';
import { NotFoundException } from '@nestjs/common';
import { Parish } from '@modules/parish/entities/parish.entity';

export class UpdateParishCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly updateParishDto: UpdateParishDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateParishCommand)
export class UpdateParishHandler implements ICommandHandler<UpdateParishCommand> {
  constructor(private readonly parishRepository: ParishRepository) {}

  async execute(command: UpdateParishCommand): Promise<Parish> {
    const { id, updateParishDto } = command;

    const parish = await this.parishRepository.findById(id);
    if (!parish) {
      throw new NotFoundException(`Parish with ID ${id} not found`);
    }

    if (updateParishDto.name) {
      parish.updateName(updateParishDto.name);
    }
    if (updateParishDto.profile) {
      parish.updateProfile(updateParishDto.profile);
    }
    if (updateParishDto.email) {
      parish.updateEmail(updateParishDto.email);
    }
    if (updateParishDto.telephone) {
      parish.updateTelephone(updateParishDto.telephone);
    }
    if (updateParishDto.slogan) {
      parish.updateSlogan(updateParishDto.slogan);
    }
    if (updateParishDto.address) {
      parish.updateAddress(updateParishDto.address);
    }
    if (updateParishDto.town) {
      parish.updateTown(updateParishDto.town);
    }
    if (updateParishDto.lga) {
      parish.updateLga(updateParishDto.lga);
    }
    if (updateParishDto.state) {
      parish.updateState(updateParishDto.state);
    }
    if (updateParishDto.postOfficeAddress) {
      parish.updatePostOfficeAddress(updateParishDto.postOfficeAddress);
    }
    if (updateParishDto.website) {
      parish.updateWebsite(updateParishDto.website);
    }
    if (updateParishDto.logo) {
      parish.updateLogo(updateParishDto.logo);
    }
    if (updateParishDto.vision) {
      parish.updateVision(updateParishDto.vision);
    }
    if (updateParishDto.mission) {
      parish.updateMission(updateParishDto.mission);
    }
    if (updateParishDto.establishedOn) {
      parish.updateEstablishedOn(updateParishDto.establishedOn);
    }
    if (updateParishDto.active !== undefined) {
      parish.updateActive(updateParishDto.active);
    }
    if (updateParishDto.isStation !== undefined) {
      parish.updateIsStation(updateParishDto.isStation);
    }
    if (updateParishDto.parentParishId) {
      parish.updateParentParishId(updateParishDto.parentParishId);
    }
    if (updateParishDto.denaryId) {
      parish.updateDenaryId(updateParishDto.denaryId);
    }
    if (updateParishDto.parishPriest) {
      parish.updateParishPriest(updateParishDto.parishPriest);
    }
    if (updateParishDto.assistantPriest1) {
      parish.updateAssistantPriest1(updateParishDto.assistantPriest1);
    }
    if (updateParishDto.assistantPriest2) {
      parish.updateAssistantPriest2(updateParishDto.assistantPriest2);
    }
    if (updateParishDto.parishPriestPhoneNumber) {
      parish.updateParishPriestPhoneNumber(updateParishDto.parishPriestPhoneNumber);
    }
    if (updateParishDto.assistantPriest1PhoneNumber) {
      parish.updateAssistantPriest1PhoneNumber(updateParishDto.assistantPriest1PhoneNumber);
    }
    if (updateParishDto.assistantPriest2PhoneNumber) {
      parish.updateAssistantPriest2PhoneNumber(updateParishDto.assistantPriest2PhoneNumber);
    }
    if (updateParishDto.updatedBy) {
      parish.updateUpdatedBy(command.userId);
    }

    return this.parishRepository.update(parish);
  }
}
