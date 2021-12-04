/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IReportInput } from '@usecases/reports/report-interfaces';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { DividendPaymentTimeSeriesReportUseCase } from '@usecases/reports/asset-dividend-payment-timeseries-report/asset-dividend-payment-timeseries-report-usecase';
import { IDividendPaymentReport } from '@usecases/reports/asset-dividend-payment-timeseries-report/asset-dividend-payment-timeseries-report-interface';
import { IAssetReport, ITimeSeriesReportOutput } from '@usecases/reports/timeseries-report-interfaces';
import DividendPaymentRepositoryMock from '@test-mocks/dividend-payment-repository-mock';

class DateValidatorUtilMock implements IDateValidatorAdapter {
  isTimeInterval(begin: Date, end: Date): boolean {
    return false;
  }

  validate(date: string | Date): boolean {
    return true;
  }
}

describe('Dividend Payments Timeseries Report UseCase', () => {
  let dividendReportUsecase: DividendPaymentTimeSeriesReportUseCase;
  let dateValidatorUtilMock: DateValidatorUtilMock;

  beforeEach(() => {
    dateValidatorUtilMock = new DateValidatorUtilMock();
    dividendReportUsecase = new DividendPaymentTimeSeriesReportUseCase(
      new DividendPaymentRepositoryMock(), dateValidatorUtilMock,
    );
  });

  it('Should return data', async () => {
    const filter: IReportInput = {
      codes: undefined,
      begin: undefined,
      end: undefined,
    };

    const test11 = {
      name: 'TEST11',
      category: 'stock',
      itens: [
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
      itens: [
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
      itens: [
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
      itens: [
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
      itens: [
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

  it('Should throw a Bad Request Error, when the date validator returns false', async () => {
    dateValidatorUtilMock.isTimeInterval = jest.fn().mockReturnValueOnce(false);
    const filter: IReportInput = {
      codes: [],
      begin: new Date('2021-08-01T23:00:00.000Z'),
      end: new Date('2021-01-01T23:00:00.000Z'),
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
