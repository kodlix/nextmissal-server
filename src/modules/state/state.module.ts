import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateRepository } from './state.repository';
import { PrismaModule } from '../../core/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StateService, StateRepository],
  exports: [StateService, StateRepository],
})
export class StateModule {}
