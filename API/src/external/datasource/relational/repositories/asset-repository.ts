import { Connection, Repository } from 'typeorm';

import { IAssetRepository } from '@domain-ports/repositories/asset-repository-interface';
import { AssetCategory, AssetEntity } from '@entities/asset';
import { AssetModel } from '../models';

export class AssetRepository implements IAssetRepository {
  private repo: Repository<AssetModel>;

  constructor(connection: Connection) {
    this.repo = connection.getRepository(AssetModel);
  }

  private static format(asset: AssetModel): AssetEntity {
    const assetEntity = new AssetEntity(
      asset.id, asset.code, asset.social, asset.logo, asset.category as AssetCategory,
    );

    return assetEntity;
  }

  public async findByCode(code: string): Promise<AssetEntity> {
    const asset = await this.repo.findOne({ code });

    return asset ? AssetRepository.format(asset) : null;
  }

  public async listAll(): Promise<AssetEntity[]> {
    const assets = await this.repo.find();

    return assets.map((asset: AssetModel) => AssetRepository.format(asset));
  }
}

export default AssetRepository;
