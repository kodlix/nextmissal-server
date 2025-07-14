import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CountryRepository } from '../country.repository';
import { StateDto } from '../../state/dto/state.dto';

export class GetStateWithLgasQuery implements IQuery {
  constructor(
    public readonly countryId: number,
    public readonly stateId: number,
  ) {}
}

@QueryHandler(GetStateWithLgasQuery)
export class GetStateWithLgasQueryHandler implements IQueryHandler<GetStateWithLgasQuery> {
  constructor(
    @Inject(CountryRepository)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(query: GetStateWithLgasQuery): Promise<StateDto> {
    return this.countryRepository.findStateWithLgas(query.countryId, query.stateId);
  }
}
