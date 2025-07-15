import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDioceseDto } from '../dtos/update-diocese.dto';
import { DioceseRepository } from '../repositories/diocese.repository';
import { Diocese } from '../entities/diocese.entity';
import { NotFoundException } from '@nestjs/common';

export class UpdateDioceseCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly updateDioceseDto: UpdateDioceseDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateDioceseCommand)
export class UpdateDioceseHandler implements ICommandHandler<UpdateDioceseCommand> {
  constructor(private readonly dioceseRepository: DioceseRepository) {}

  async execute(command: UpdateDioceseCommand): Promise<Diocese> {
    const { id, updateDioceseDto } = command;

    const diocese = await this.dioceseRepository.findById(id);
    if (!diocese) {
      throw new NotFoundException(`Diocese with ID ${id} not found`);
    }

    if (updateDioceseDto.name) {
      diocese.updateName(updateDioceseDto.name);
    }
    if (updateDioceseDto.profile) {
      diocese.updateProfile(updateDioceseDto.profile);
    }
    if (updateDioceseDto.cathedral) {
      diocese.updateCathedral(updateDioceseDto.cathedral);
    }
    if (updateDioceseDto.address) {
      diocese.updateAddress(updateDioceseDto.address);
    }
    if (updateDioceseDto.telephones) {
      diocese.updateTelephones(updateDioceseDto.telephones);
    }
    if (updateDioceseDto.emails) {
      diocese.updateEmails(updateDioceseDto.emails);
    }
    if (updateDioceseDto.province) {
      diocese.updateProvince(updateDioceseDto.province);
    }
    if (updateDioceseDto.bishop) {
      diocese.updateBishop(updateDioceseDto.bishop);
    }
    if (updateDioceseDto.isArchidiocese !== undefined) {
      diocese.updateIsArchidiocese(updateDioceseDto.isArchidiocese);
    }
    if (updateDioceseDto.countryId) {
      diocese.updateCountryId(updateDioceseDto.countryId);
    }
    if (updateDioceseDto.active !== undefined) {
      diocese.updateActive(updateDioceseDto.active);
    }
    if (updateDioceseDto.updatedBy) {
      diocese.updateUpdatedBy(command.userId);
    }

    return this.dioceseRepository.update(diocese);
  }
}
