import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DenaryRepository } from '../repositories/denary.repository';
import { Denary } from '../entities/denary.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateDenaryDto } from '../dtos/update-denary.dto';

export class UpdateDenaryCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly updateDenaryDto: UpdateDenaryDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateDenaryCommand)
export class UpdateDenaryHandler implements ICommandHandler<UpdateDenaryCommand> {
  constructor(private readonly denaryRepository: DenaryRepository) {}

  async execute(command: UpdateDenaryCommand): Promise<Denary> {
    const { id, updateDenaryDto } = command;

    const denary = await this.denaryRepository.findById(id);
    if (!denary) {
      throw new NotFoundException(`Denary with ID ${id} not found`);
    }

    if (updateDenaryDto.name) {
      denary.updateName(updateDenaryDto.name);
    }
    if (updateDenaryDto.dean) {
      denary.updateDean(updateDenaryDto.dean);
    }
    if (updateDenaryDto.address) {
      denary.updateAddress(updateDenaryDto.address);
    }
    if (updateDenaryDto.dioceseId) {
      denary.updateDioceseId(updateDenaryDto.dioceseId);
    }
    if (updateDenaryDto.profile) {
      denary.updateProfile(updateDenaryDto.profile);
    }
    if (updateDenaryDto.active !== undefined) {
      denary.updateActive(updateDenaryDto.active);
    }
    if (updateDenaryDto.updatedBy) {
      denary.updateUpdatedBy(command.userId);
    }

    return this.denaryRepository.update(denary);
  }
}
