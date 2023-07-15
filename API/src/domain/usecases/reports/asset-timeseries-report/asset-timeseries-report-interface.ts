import { ITimeSeriesReportUseCase } from '../timeseries-report-interfaces';

export interface IPositionReport {
  quantity : number;
  price : number;
  date : Date;
  value : number;
  averageBuyPrice: number;
  profitability: number;
}

export interface IAssetTimeSeriesReportUseCase
  extends ITimeSeriesReportUseCase<IPositionReport> {
}
