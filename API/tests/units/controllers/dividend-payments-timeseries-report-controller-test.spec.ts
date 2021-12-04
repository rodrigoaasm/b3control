/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import { ITimeSeriesReportOutput, ITimeSeriesReportUseCase } from '@usecases/reports/timeseries-report-interfaces';
import { IReportInput } from '@usecases/reports/report-interfaces';
import { IApplicationRequest } from '@application/types';
import { IReportInputHandler } from '@usecases/reports/report-input-handler-interface';
import { IDividendPaymentReport } from '@usecases/reports/asset-dividend-payment-timeseries-report/asset-dividend-payment-timeseries-report-interface';
import DividendPaymentTimeseriesController from '@controllers/dividend-payment-timeseries-report-controller';

class DividendPaymentsTimeseriesReportUseCaseMock
implements ITimeSeriesReportUseCase<IDividendPaymentReport> {
  async get(filters: IReportInput): Promise<ITimeSeriesReportOutput<IDividendPaymentReport>> {
    return {
      filters,
    } as any;
  }
}

class ReportInputHandlerMock implements IReportInputHandler {
  handle = jest.fn();
}

describe('Dividend Payment Timeseries Controller', () => {
  let dividendPaymentTimeseriesController: DividendPaymentTimeseriesController;
  let dividendPaymentsTimeseriesReportUseCaseMock: DividendPaymentsTimeseriesReportUseCaseMock;
  let reportInputHandlerMock: IReportInputHandler;

  beforeEach(() => {
    reportInputHandlerMock = new ReportInputHandlerMock();
    dividendPaymentsTimeseriesReportUseCaseMock = new DividendPaymentsTimeseriesReportUseCaseMock();
    dividendPaymentTimeseriesController = new DividendPaymentTimeseriesController(
      dividendPaymentsTimeseriesReportUseCaseMock, reportInputHandlerMock,
    );
  });

  it('Should execute the listing successfully, when no filter is entered', async () => {
    const request: IApplicationRequest = {
      body: {},
      header: {},
      params: {},
    };

    const response = await dividendPaymentTimeseriesController
      .getDividendPaymentTimeseries(request);

    expect(response.code).toEqual(200);
  });

  it('Should return an error when any of the filters is invalid', async () => {
    reportInputHandlerMock.handle = jest.fn().mockImplementationOnce(() => {
      throw new Error('filters invalid');
    });
    const request: IApplicationRequest = {
      body: {},
      header: {},
      params: {
        begin: 'Invalid Date',
      },
    };

    let error;
    try {
      await dividendPaymentTimeseriesController.getDividendPaymentTimeseries(request);
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual('filters invalid');
  });
});
