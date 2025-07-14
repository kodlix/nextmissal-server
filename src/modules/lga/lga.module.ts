import { Module } from '@nestjs/common';
import { LgaService } from './lga.service';
import { LgaRepository } from './lga.repository';
import { PrismaModule } from '../../core/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LgaService, LgaRepository],
  exports: [LgaService, LgaRepository],
})
export class LgaModule {}
