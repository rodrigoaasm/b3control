import { AssetEntity } from '@entities/asset/';

export interface IAssetRepository {
  findByCode (code : string) : Promise<AssetEntity>;
  listAll(): Promise<Array<AssetEntity>>
}
