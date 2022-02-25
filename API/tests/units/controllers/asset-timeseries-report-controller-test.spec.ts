/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import { AssetTimeseriesReportController } from '@controllers/asset-timeseries-report-controller';
import { ITimeSeriesReportOutput, ITimeSeriesReportUseCase } from '@usecases/reports/timeseries-report-interfaces';
import { IReportInput } from '@usecases/reports/report-interfaces';
import { IApplicationRequest } from '@application/types';
import { IPositionReport } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-interface';
import { IReportInputHandler } from '@usecases/reports/report-input-handler-interface';

class AssetTimeSeriesReportUseCaseMock implements ITimeSeriesReportUseCase<IPositionReport> {
  async get(filters: IReportInput): Promise<ITimeSeriesReportOutput<IPositionReport>> {
    return {
      filters,
    } as any;
  }
}

class ReportInputHandlerMock implements IReportInputHandler {
  handle = jest.fn();
}

describe('Asset Timeseries Report Controller', () => {
  let reportsController;
  let assetTimeSeriesReportUseCaseMock;
  let reportInputHandlerMock;

  beforeEach(() => {
    reportInputHandlerMock = new ReportInputHandlerMock();
    assetTimeSeriesReportUseCaseMock = new AssetTimeSeriesReportUseCaseMock();
    reportsController = new AssetTimeseriesReportController(
      assetTimeSeriesReportUseCaseMock, reportInputHandlerMock,
    );
  });

  it('Should execute the listing successfully, when no filter is entered', async () => {
    const request: IApplicationRequest = {
      body: {},
      headers: {},
      params: {},
    };

    const response = await reportsController.getStockTimeseries(request);

    expect(response.code).toEqual(200);
  });

  it('Should return an error when any of the filters is invalid', async () => {
    reportInputHandlerMock.handle = jest.fn().mockImplementationOnce(() => {
      throw new Error('filters invalid');
    });
    const request: IApplicationRequest = {
      body: {},
      headers: {},
      params: {
        begin: 'Invalid Date',
      },
    };

    let error;
    try {
      await reportsController.getStockTimeseries(request);
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual('filters invalid');
  });
});
