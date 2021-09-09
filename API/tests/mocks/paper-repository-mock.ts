import { IPaperRepository } from '@domain-ports/repositories/ipaper-repository';
import { PaperEntity } from '@entities/paper/paper-entity';

export default class PaperRepositoryMock implements IPaperRepository {
  private items: PaperEntity [] = [
    {
      id: 1,
      code: 'TEST11',
      social: 'Teste',
      logo: '',
      category: 'stock',
    },
  ];

  public findByCode(code: string): Promise<PaperEntity> {
    const paper = this.items.find((item) => item.code === code);
    return Promise.resolve(paper);
  }
}
