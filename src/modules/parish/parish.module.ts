import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ParishController } from './parish.controller';
import { ParishRepository } from './repositories/parish.repository';
import { CreateParishHandler } from './commands/handlers/create-parish.handler';
import { UpdateParishHandler } from './commands/handlers/update-parish.handler';
import { DeleteParishHandler } from './commands/handlers/delete-parish.handler';
import { GetParishByIdHandler } from './queries/handlers/get-parish-by-id.handler';
import { GetParishesHandler } from './queries/handlers/get-parishes.handler';
import { PrismaModule } from '@core/database/prisma/prisma.module';

const commandHandlers = [CreateParishHandler, UpdateParishHandler, DeleteParishHandler];
const queryHandlers = [GetParishByIdHandler, GetParishesHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [ParishController],
  providers: [...commandHandlers, ...queryHandlers, ParishRepository],
  exports: [ParishRepository],
})
export class ParishModule {}
