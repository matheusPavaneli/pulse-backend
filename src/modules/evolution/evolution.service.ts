import { Inject, Injectable } from '@nestjs/common';
import IEvolutionApiConfig from 'src/common/interfaces/IEvolutionApiConfig';

@Injectable()
export class EvolutionService {
  constructor(
    @Inject('EVOLUTION_CONFIG') private evolutionConfig: IEvolutionApiConfig,
  ) {}
}
