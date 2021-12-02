import { ITimeSeriesReportUseCase } from '../timeseries-report-interfaces';

export interface IDividendPaymentReport {
  date : Date;
  value : number;
}

export interface IDividendPaymentsTimeSeriesReportUseCase
  extends ITimeSeriesReportUseCase<IDividendPaymentReport>{
}
