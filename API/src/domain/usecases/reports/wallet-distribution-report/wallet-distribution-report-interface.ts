import { AssetCategory, AssetEntity } from '@entities/asset';
import { IReportInput, IReportUseCase, IReportOutput } from '../report-interfaces';

export interface ICurrentPosition {
  _quantity ?: number;
  _price ?: number;
  _value : number;
  _date : Date;
}

export interface IAssetCurrentPosition extends ICurrentPosition {
  _asset: AssetEntity;
}

export interface ICategoryCurrentPosition extends ICurrentPosition {
  _category: AssetCategory;
}

export interface IWalletDistributionOutput extends IReportOutput {
  assets: IAssetCurrentPosition[];
  categories: ICategoryCurrentPosition[]
}

export interface IWalletDistributionUseCase
  extends IReportUseCase<IReportInput, IWalletDistributionOutput>{

}
