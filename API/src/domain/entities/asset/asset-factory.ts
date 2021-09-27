import { ConstructorEntityError } from '@domain-error/custom-error';
import { AssetCategory } from './asset-category';
import { AssetEntity } from './asset-entity';

export class AssetFactory {
  // eslint-disable-next-line class-methods-use-this
  static make(id : number, code : string, social : string,
    logo : string, category : AssetCategory): AssetEntity {
    if (!id) {
      throw ConstructorEntityError('It was not possible create the stock object!\n Stock id not found.');
    }

    if (!code) {
      throw ConstructorEntityError('It was not possible create the stock object!\n Stock code not found.');
    }

    if (category !== 'stock' && category !== 'general') {
      throw ConstructorEntityError("It was not possible create the stock object!\n The category is invalid! Expect 'stock' or 'general'.");
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
