import { IAssetRepository } from '@domain-ports/repositories/asset-repository-interface';
import { AssetEntity } from '@entities/asset';
import { IAssetsListingItem, IAssetsListingOutput, IAssetsListingUsecase } from './assets-listing-interface';

export class AssetsListingUsecase implements IAssetsListingUsecase {
  constructor(private assetRepository: IAssetRepository) {
  }

  private static formatOutput(assets: AssetEntity[]): IAssetsListingOutput {
    const output = assets.map((asset: AssetEntity) => ({
      ...asset,
    } as IAssetsListingItem));
    return output;
  }

  public async list(): Promise<IAssetsListingOutput> {
    const assets = await this.assetRepository.listAll();
    return AssetsListingUsecase.formatOutput(assets);
  }
}

export default AssetsListingUsecase;
