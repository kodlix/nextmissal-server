import { Injectable } from '@nestjs/common';
import { LgaRepository } from './lga.repository';

@Injectable()
export class LgaService {
  constructor(private readonly lgaRepository: LgaRepository) {}
}
