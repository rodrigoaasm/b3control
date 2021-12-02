import { ITimeSeriesReportUseCase } from '../timeseries-report-interfaces';

export interface IPositionReport {
  quantity : number;
  price : number;
  date : Date;
  value : number;
}

export interface IAssetTimeSeriesReportUseCase
  extends ITimeSeriesReportUseCase<IPositionReport> {
}
