import { AggregateRoot } from '@nestjs/cqrs';
import { Programme, ProgrammeFrequency } from '@prisma/client';

export class ProgrammeEntity extends AggregateRoot implements Programme {
  id: number;
  name: string;
  description: string;
  hint: string | null;
  active: boolean;
  programmeType: string;
  isGeneral: boolean;
  venue: string;
  startTime: Date | null;
  endTime: Date | null;
  frequency: ProgrammeFrequency;
  frequencyInfo: string | null;
  parishId: number | null;
  denaryId: number | null;
  dioceseId: number | null;
  societyId: number | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number | null;
  updatedBy: number | null;

  constructor(properties: Partial<ProgrammeEntity>) {
    super();
    Object.assign(this, properties);
  }

  get props(): Programme {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      hint: this.hint,
      active: this.active,
      programmeType: this.programmeType,
      isGeneral: this.isGeneral,
      venue: this.venue,
      startTime: this.startTime,
      endTime: this.endTime,
      frequency: this.frequency,
      frequencyInfo: this.frequencyInfo,
      parishId: this.parishId,
      denaryId: this.denaryId,
      dioceseId: this.dioceseId,
      societyId: this.societyId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
    };
  }
}
