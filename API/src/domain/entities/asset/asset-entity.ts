import { AssetCategory } from './asset-category';

export interface AssetEntity {
  id : number;
  code : string;
  social : string;
  logo : string;
  category : AssetCategory;
}
