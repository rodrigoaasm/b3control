import { AssetCategory } from '@entities/asset';

export interface IAssetsListingItem {
  _id: number;
  _code: string;
  _social: string;
  _logo: string;
  _category: AssetCategory;
}

export type IAssetsListingOutput = IAssetsListingItem[];

export interface IAssetsListingUsecase {
  list(): Promise<IAssetsListingOutput>
}
