import { AssetCategory } from './asset-category';
import { AssetEntity } from './asset-entity';

export class AssetFactory {
  static getInstance(id : number, code : string, social : string,
    logo : string, category : AssetCategory): AssetEntity {
    if (!id) {
      throw new Error('It was not possible create the stock object!\n Stock id not found.');
    }

    if (!code) {
      throw new Error('It was not possible create the stock object!\n Stock code not found.');
    }

    if (category !== 'stock' && category !== 'general') {
      throw new Error("It was not possible create the stock object!\n The category is invalid! Expect 'stock' or 'papper'.");
    }
    const asset = {
      id,
      code,
      social,
      logo,
      category,
    };

    return asset;
  }
}

export default AssetFactory;
