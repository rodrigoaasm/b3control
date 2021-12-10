import { ITimeSeriesReportUseCase } from '../timeseries-report-interfaces';
import { IReportInput } from '../report-interfaces';

export interface IDividendPaymentReport {
  date : Date;
  value : number;
}

export interface IDividendPaymentsTimeSeriesReportInput extends IReportInput {
  beginMonth ?: string,
  endMonth ?: string
}

export interface IDividendPaymentsTimeSeriesReportUseCase
  extends ITimeSeriesReportUseCase<IDividendPaymentReport>{
}
