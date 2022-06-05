import { AssetCategory, AssetEntity } from '@entities/asset';
import { IReportInput, IReportUseCase, IReportOutput } from '../report-interfaces';

export interface ICurrentPosition {
  quantity ?: number;
  price ?: number;
  value : number;
  date : Date;
}

export interface IAssetCurrentPosition extends ICurrentPosition {
  asset: AssetEntity;
}

export interface ICategoryCurrentPosition extends ICurrentPosition {
  category: AssetCategory;
}

export interface IWalletDistributionOutput extends IReportOutput {
  assets: IAssetCurrentPosition[];
  categories: ICategoryCurrentPosition[]
}

export interface IWalletDistributionUseCase
  extends IReportUseCase<IReportInput, IWalletDistributionOutput>{

}
