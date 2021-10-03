import { AssetCategory } from '@entities/asset';

import { IReportInput, IReportOutput, IReportUseCase } from '../report-interfaces';

export interface IPositionReport {
  quantity : number;
  price : number;
  date : Date;
  value : number;
}

export interface IAssetReport {
  name : string,
  category : AssetCategory,
  positions : Array<IPositionReport>
}

export interface IAssetCategoryReport {
  name : string,
  positions : Array<IPositionReport>
}

export interface IAssetTimeSeriesReportOutput extends IReportOutput{
  categories : Array<IAssetCategoryReport>,
  assets : Array<IAssetReport>
}

export interface IAssetTimeSeriesReportUseCase
  extends IReportUseCase<IReportInput, IAssetTimeSeriesReportOutput> {
}
