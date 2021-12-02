import { AssetCategory } from '@entities/asset';
import { IReportInput, IReportOutput, IReportUseCase } from './report-interfaces';

export interface IAssetReport<T> {
  name : string,
  category : AssetCategory,
  itens : Array<T>
}

export interface IAssetCategoryReport<T> {
  name : string,
  itens : Array<T>
}

export interface ITimeSeriesReportOutput<T> extends IReportOutput{
  categories : Array<IAssetCategoryReport<T>>,
  assets : Array<IAssetReport<T>>
}

export interface ITimeSeriesReportUseCase<T>
  extends IReportUseCase<IReportInput, ITimeSeriesReportOutput<T>> {
}
