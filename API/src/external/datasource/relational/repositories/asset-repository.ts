import { getRepository, Repository } from 'typeorm';

import { IAssetRepository } from '@domain-ports/repositories/asset-repository-interface';
import { AssetCategory, AssetEntity, AssetFactory } from '@entities/asset';
import { AssetModel } from '../models';

export class AssetRepository implements IAssetRepository {
  private repo: Repository<AssetModel>;

  constructor() {
    this.repo = getRepository(AssetModel);
  }

  public async findByCode(code: string): Promise<AssetEntity> {
    const asset = await this.repo.findOne({ code });

    return asset ? AssetFactory.make(
      asset.id, asset.code, asset.social, asset.logo, asset.category as AssetCategory,
    ) : null;
  }
}

export default AssetRepository;
