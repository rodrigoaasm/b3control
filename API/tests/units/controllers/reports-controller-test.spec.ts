/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReportsController } from '@controllers/reports-controller';
import { ITimeSeriesReportOutput, ITimeSeriesReportUseCase } from '@usecases/reports/timeseries-report-interfaces';
import { IReportInput } from '@usecases/reports/report-interfaces';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { IApplicationRequest, IApplicationResponse } from '@application/types';
import { IPositionReport } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-interface';

class AssetTimeSeriesReportUseCaseMock implements ITimeSeriesReportUseCase<IPositionReport> {
  async get(filters: IReportInput): Promise<ITimeSeriesReportOutput<IPositionReport>> {
    return {
      filters,
    } as any;
  }
}

class DateValidatorUtilMock implements IDateValidatorAdapter {
  isTimeInterval(begin: Date, end: Date): boolean {
    return true;
  }

  validate(date: string | Date): boolean {
    return true;
  }
}

describe('Reports Controller', () => {
  let reportsController;
  let assetTimeSeriesReportUseCaseMock;
  let dateValidatorUtilMock;

  beforeEach(() => {
    dateValidatorUtilMock = new DateValidatorUtilMock();
    assetTimeSeriesReportUseCaseMock = new AssetTimeSeriesReportUseCaseMock();
    reportsController = new ReportsController(
      assetTimeSeriesReportUseCaseMock, dateValidatorUtilMock,
    );
  });

  it('Should execute the listing successfully, when no filter is entered', async () => {
    const request: IApplicationRequest = {
      body: {},
      header: {},
      params: {},
    };

    const response = await reportsController.getStockTimeLine(request);

    expect(response.code).toEqual(200);
    expect(response.body.filters.codes.length).toEqual(0);
  });

  it('Should execute the listing successfully, when an asset code list is entered', async () => {
    const request: IApplicationRequest = {
      body: {},
      header: {},
      params: {
        codes: 'TEST4,TEST3,TEST11',
      },
    };

    const response = await reportsController.getStockTimeLine(request);

    expect(response.code).toEqual(200);
    expect(response.body.filters.codes.length).toEqual(3);
  });

  it('Should execute the listing successfully, when the begin date is valid', async () => {
    const request: IApplicationRequest = {
      body: {},
      header: {},
      params: {
        begin: new Date(),
      },
    };

    const response = await reportsController.getStockTimeLine(request);

    expect(response.code).toEqual(200);
    expect(response.body.filters.begin).toBeDefined();
  });

  it('Should execute the listing successfully, when the end date is valid', async () => {
    const request: IApplicationRequest = {
      body: {},
      header: {},
      params: {
        end: new Date(),
      },
    };

    const response = await reportsController.getStockTimeLine(request);

    expect(response.code).toEqual(200);
    expect(response.body.filters.end).toBeDefined();
  });

  it('Should throw a Bad Request Error, when the begin date is invalid', async () => {
    dateValidatorUtilMock.validate = jest.fn().mockReturnValueOnce(false);
    const request: IApplicationRequest = {
      body: {},
      header: {},
      params: {
        begin: 'Invalid Date',
      },
    };

    let error;
    try {
      const response = await reportsController.getStockTimeLine(request);
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual('The begin date is invalid.');
    expect(error.status).toEqual('BAD_REQUEST_ERROR');
  });

  it('Should throw a Bad Request Error, when the end date is invalid', async () => {
    dateValidatorUtilMock.validate = jest.fn().mockReturnValueOnce(false);
    const request: IApplicationRequest = {
      body: {},
      header: {},
      params: {
        end: 'Invalid Date',
      },
    };

    let error;
    try {
      const response = await reportsController.getStockTimeLine(request);
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual('The end date is invalid.');
    expect(error.status).toEqual('BAD_REQUEST_ERROR');
  });
});
