import { IAssetRepository } from '@domain-ports/repositories/asset-repository-interface';
import { AssetEntity } from '@entities/asset/';

export default class AssetRepositoryMock implements IAssetRepository {
  private items: AssetEntity [] = [
    new AssetEntity(1, 'TEST11', 'Teste', '', 'stock'),
    new AssetEntity(2, 'TEST4', 'Teste', '', 'stock'),
  ];

  public findByCode(code: string): Promise<AssetEntity> {
    const paper = this.items.find((item) => item.code === code);
    return Promise.resolve(paper);
  }

  public listAll(): Promise<AssetEntity[]> {
    return Promise.resolve(this.items);
  }
}
