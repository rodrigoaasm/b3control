/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IReportInput } from '@usecases/reports/report-interfaces';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { DividendPaymentTimeSeriesReportUseCase } from '@usecases/reports/asset-dividend-payment-timeseries-report/asset-dividend-payment-timeseries-report-usecase';
import { IDividendPaymentReport, IDividendPaymentsTimeSeriesReportInput } from '@usecases/reports/asset-dividend-payment-timeseries-report/asset-dividend-payment-timeseries-report-interface';
import { IAssetReport, ITimeSeriesReportOutput } from '@usecases/reports/timeseries-report-interfaces';
import DividendPaymentRepositoryMock from '@test-mocks/dividend-payment-repository-mock';
import { IDateHandlerAdapter } from '@domain-ports/adapters/date-handler-adapter-interface';
import { IReportInputHandler } from '@usecases/reports/report-input-handler-interface';

class DateValidatorUtilMock implements IDateValidatorAdapter {
  isTimeInterval(begin: Date, end: Date): boolean {
    return false;
  }

  validate(date: string | Date): boolean {
    return true;
  }
}

class DateHandlerUtilMock implements IDateHandlerAdapter {
  parse(dateString: string, format: string): Date {
    return new Date(`${dateString}-01T00:00:00.000`);
  }
}

describe('Dividend Payments Timeseries Report UseCase', () => {
  let dividendReportUsecase: DividendPaymentTimeSeriesReportUseCase;
  let dateValidatorUtilMock: DateValidatorUtilMock;
  let dateHandlerUtilMock: DateHandlerUtilMock;
  let dividendPaymentRepositoryMock: DividendPaymentRepositoryMock;

  beforeEach(() => {
    dateValidatorUtilMock = new DateValidatorUtilMock();
    dateHandlerUtilMock = new DateHandlerUtilMock();
    dividendPaymentRepositoryMock = new DividendPaymentRepositoryMock();
    dividendReportUsecase = new DividendPaymentTimeSeriesReportUseCase(
      dividendPaymentRepositoryMock, dateValidatorUtilMock, dateHandlerUtilMock,
    );
  });

  it('Should return all data', async () => {
    dateValidatorUtilMock.isTimeInterval = jest.fn().mockReturnValueOnce(true);
    const filter: IDividendPaymentsTimeSeriesReportInput = {
      codes: undefined,
      begin: undefined,
      end: undefined,
      beginMonth: '2021-01',
      endMonth: '2021-03',
    };

    const test11 = {
      name: 'TEST11',
      category: 'stock',
      items: [
        {
          date: new Date('2021-01-31T00:00:00.000Z'),
          value: 5,
        },
        {
          value: 5,
          date: new Date('2021-02-28T00:00:00.000Z'),
        },
        {
          date: new Date('2021-03-30T00:00:00.000Z'),
          value: 5,
        },
      ],
    } as IAssetReport<IDividendPaymentReport>;

    const test4 = {
      name: 'TEST4',
      category: 'stock',
      items: [
        {
          date: new Date('2021-01-31T00:00:00.000Z'),
          value: 7,
        },
        {
          date: new Date('2021-02-28T00:00:00.000Z'),
          value: 0,
        },
        {
          date: new Date('2021-03-30T00:00:00.000Z'),
          value: 7,
        },
      ],
    } as IAssetReport<IDividendPaymentReport>;

    const test3 = {
      name: 'TEST3',
      category: 'general',
      items: [
        {
          date: new Date('2021-01-31T00:00:00.000Z'),
          value: 0,
        },
        {
          date: new Date('2021-02-28T00:00:00.000Z'),
          value: 0,
        },
        {
          date: new Date('2021-03-30T00:00:00.000Z'),
          value: 0,
        },
      ],
    } as IAssetReport<IDividendPaymentReport>;

    const stockCategory = {
      name: 'stock',
      items: [
        {
          date: new Date('2021-01-31T00:00:00.000Z'),
          value: 12,
        },
        {
          date: new Date('2021-02-28T00:00:00.000Z'),
          value: 5,
        },
        {
          date: new Date('2021-03-30T00:00:00.000Z'),
          value: 12,
        },
      ],
    };

    const generalCategory = {
      name: 'general',
      items: [
        {
          date: new Date('2021-01-31T00:00:00.000Z'),
          value: 0,
        },
        {
          date: new Date('2021-02-28T00:00:00.000Z'),
          value: 0,
        },
        {
          date: new Date('2021-03-30T00:00:00.000Z'),
          value: 0,
        },
      ],
    };

    const output = await dividendReportUsecase.get(filter);

    expect(output).toEqual({
      assets: [
        test11,
        test4,
        test3,
      ],
      categories: [
        stockCategory,
        generalCategory,
      ],
    });
  });

  it('Should return an empty dataset, when the repository does not return anything', async () => {
    dateValidatorUtilMock.isTimeInterval = jest.fn().mockReturnValueOnce(true);
    const filter: IReportInput = {
      codes: ['notexits'],
      begin: undefined,
      end: undefined,
    };
    const output = await dividendReportUsecase.get(filter);

    expect(output).toEqual({
      assets: [],
      categories: [],
    } as ITimeSeriesReportOutput<IDividendPaymentReport>);
  });

  it('Should generate a time interval that includes only the current month when the month time interval was not entered', async () => {
    dateValidatorUtilMock.isTimeInterval = jest.fn().mockReturnValueOnce(true);
    dividendPaymentRepositoryMock.getDividendPaymentsByMonth = jest.fn()
      .mockImplementationOnce((codes: string[], begin: Date, end: Date) => {
        const currentDate = new Date();
        const expectedBeginDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const expectedEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        expect(begin).toEqual(expectedBeginDate);
        expect(end).toEqual(expectedEndDate);
        return [];
      });

    const filter: IReportInput = {
      codes: undefined,
      begin: undefined,
      end: undefined,
    };
    const output = await dividendReportUsecase.get(filter);

    expect.assertions(2);
  });

  it('Should throw a Bad Request Error, when the date validator returns false', async () => {
    dateValidatorUtilMock.isTimeInterval = jest.fn().mockReturnValueOnce(false);
    const filter: IDividendPaymentsTimeSeriesReportInput = {
      codes: [],
      beginMonth: '2021-08',
      endMonth: '2021-01',
    };

    let error;
    try {
      await dividendReportUsecase.get(filter);
    } catch (serviceError) {
      error = serviceError;
    }

    expect(error.message).toEqual('The end date is greater than begin date.');
    expect(error.status).toEqual('BAD_REQUEST_ERROR');
  });
});
