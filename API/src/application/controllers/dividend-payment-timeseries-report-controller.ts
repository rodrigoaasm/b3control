import { IApplicationRequest, IApplicationResponse } from '@application/types';
import { IDividendPaymentsTimeSeriesReportUseCase } from '@usecases/reports/asset-dividend-payment-timeseries-report/asset-dividend-payment-timeseries-report-interface';
import { IReportInputHandler } from '@usecases/reports/report-input-handler-interface';

export class DividendPaymentTimeseriesController {
  constructor(
    private dividendPaymentsTimeSeriesReportUseCase: IDividendPaymentsTimeSeriesReportUseCase,
    private reportInputHandler: IReportInputHandler,
  ) {

  }

  public getDividendPaymentTimeseries =
  async (req : IApplicationRequest) : Promise<IApplicationResponse> => {
    const filters = this.reportInputHandler.handle(req.params);
    const result = await this.dividendPaymentsTimeSeriesReportUseCase.get(filters);
    return {
      code: 200,
      body: result,
    };
  };
}

export default DividendPaymentTimeseriesController;
