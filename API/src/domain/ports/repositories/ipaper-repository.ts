import { PaperEntity } from '@entities/paper/paper-entity';

export interface IPaperRepository {
  findByCode (code : string) : Promise<PaperEntity>;
}
