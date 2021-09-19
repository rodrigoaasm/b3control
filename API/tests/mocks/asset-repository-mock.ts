import { IAssetRepository } from '@domain-ports/repositories/iasset-repository';
import { AssetEntity } from '@entities/asset/';

export default class AssetRepositoryMock implements IAssetRepository {
  private items: AssetEntity [] = [
    {
      id: 1,
      code: 'TEST11',
      social: 'Teste',
      logo: '',
      category: 'stock',
    },
  ];

  public findByCode(code: string): Promise<AssetEntity> {
    const paper = this.items.find((item) => item.code === code);
    return Promise.resolve(paper);
  }
}
