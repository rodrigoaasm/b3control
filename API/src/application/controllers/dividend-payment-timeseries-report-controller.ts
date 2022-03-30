import { IApplicationRequest, IApplicationResponse } from '@application/types';
import {
  IDividendPaymentsTimeSeriesReportInput,
  IDividendPaymentsTimeSeriesReportUseCase,
} from '@usecases/reports/asset-dividend-payment-timeseries-report/asset-dividend-payment-timeseries-report-interface';

export class DividendPaymentTimeseriesController {
  constructor(
    private dividendPaymentsTimeSeriesReportUseCase: IDividendPaymentsTimeSeriesReportUseCase,
  ) {

  }

  public getDividendPaymentTimeseries =
  async (req : IApplicationRequest) : Promise<IApplicationResponse> => {
    const filters: IDividendPaymentsTimeSeriesReportInput = {
      userId: req.headers.owner,
      codes: req.params.codes ? req.params.codes.split(',') : [],
      beginMonth: req.params.begin,
      endMonth: req.params.end,
    };

    const result = await this.dividendPaymentsTimeSeriesReportUseCase.get(filters);
    return {
      code: 200,
      body: result,
    };
  };
}

export default DividendPaymentTimeseriesController;
