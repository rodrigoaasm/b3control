/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssetTimeSeriesReportUseCase } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-usecase';
import { PositionRepositoryMock } from '@test-mocks/position-repository-mock';
import { IAssetReport, ITimeSeriesReportInput, ITimeSeriesReportOutput } from '@usecases/reports/timeseries-report-interfaces';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { IPositionReport } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-interface';
import { UserEntity } from '@entities/user';

const defaultDate = new Date();
const defaultUser = new UserEntity('jbfjbkglkbnlknglkb', 'user', defaultDate, defaultDate);

class DateValidatorUtilMock implements IDateValidatorAdapter {
  isTimeInterval(begin: Date, end: Date): boolean {
    return false;
  }

  validate(date: string | Date): boolean {
    return true;
  }
}

describe('Asset Timeseries Report UseCase', () => {
  let assetTimeseriesReportUsecase: AssetTimeSeriesReportUseCase;
  let dateValidatorUtilMock: DateValidatorUtilMock;

  beforeEach(() => {
    dateValidatorUtilMock = new DateValidatorUtilMock();
    assetTimeseriesReportUsecase = new AssetTimeSeriesReportUseCase(
      new PositionRepositoryMock(), dateValidatorUtilMock,
    );
  });

  it('Should return formatted data, when repository returns data', async () => {
    const filter: ITimeSeriesReportInput = {
      userId: defaultUser.id,
      codes: undefined,
      begin: undefined,
      end: undefined,
    };

    const test11 = {
      name: 'TEST11',
      category: 'stock',
      items: [
        {
          quantity: 200,
          price: 20,
          date: new Date('2021-01-31T00:00:00.000Z'),
          value: 4000,
        },
        {
          quantity: 200,
          price: 20,
          date: new Date('2021-02-28T00:00:00.000Z'),
          value: 4000,
        },
        {
          quantity: 240,
          price: 10,
          date: new Date('2021-03-30T00:00:00.000Z'),
          value: 2400,
        },
      ],
    } as IAssetReport<IPositionReport>;

    const test4 = {
      name: 'TEST4',
      category: 'stock',
      items: [
        {
          quantity: 150,
          price: 10,
          date: new Date('2021-02-28T00:00:00.000Z'),
          value: 1500,
        },
        {
          quantity: 140,
          price: 10,
          date: new Date('2021-03-30T00:00:00.000Z'),
          value: 1400,
        },
      ],
    } as IAssetReport<IPositionReport>;

    const test3 = {
      name: 'TEST3',
      category: 'FII',
      items: [
        {
          quantity: 100,
          price: 10,
          date: new Date('2021-01-31T00:00:00.000Z'),
          value: 1000,
        },
        {
          quantity: 50,
          price: 12,
          date: new Date('2021-02-28T00:00:00.000Z'),
          value: 600,
        },
      ],
    } as IAssetReport<IPositionReport>;

    const stockCategory = {
      name: 'stock',
      items: [
        {
          quantity: 200,
          price: 20,
          date: new Date('2021-01-31T00:00:00.000Z'),
          value: 4000,
        },
        {
          quantity: 350,
          price: 15.714,
          date: new Date('2021-02-28T00:00:00.000Z'),
          value: 5500,
        },
        {
          quantity: 380,
          price: 10,
          date: new Date('2021-03-30T00:00:00.000Z'),
          value: 3800,
        },
      ],
    };

    const FIICategory = {
      name: 'FII',
      items: [
        {
          quantity: 100,
          price: 10,
          date: new Date('2021-01-31T00:00:00.000Z'),
          value: 1000,
        },
        {
          quantity: 50,
          price: 12,
          date: new Date('2021-02-28T00:00:00.000Z'),
          value: 600,
        },
      ],
    };

    const output = await assetTimeseriesReportUsecase.get(filter);

    expect(output).toEqual({
      assets: [
        test11,
        test3,
        test4,
      ],
      categories: [
        stockCategory,
        FIICategory,
      ],
    });
  });

  it('Should return an empty dataset, when the repository does not return anything', async () => {
    const filter: ITimeSeriesReportInput = {
      userId: defaultUser.id,
      codes: ['notexits'],
      begin: undefined,
      end: undefined,
    };
    const output = await assetTimeseriesReportUsecase.get(filter);

    expect(output).toEqual({
      assets: [],
      categories: [],
    } as ITimeSeriesReportOutput<IPositionReport>);
  });

  it('Should throw a Bad Request Error, when the date validator returns false', async () => {
    dateValidatorUtilMock.isTimeInterval = jest.fn().mockReturnValueOnce(false);
    const filter: ITimeSeriesReportInput = {
      userId: defaultUser.id,
      codes: [],
      begin: new Date('2021-08-01T23:00:00.000Z'),
      end: new Date('2021-01-01T23:00:00.000Z'),
    };

    let error;
    try {
      await assetTimeseriesReportUsecase.get(filter);
    } catch (serviceError) {
      error = serviceError;
    }

    expect(error.message).toEqual('The begin date is greater than end date.');
    expect(error.status).toEqual('BAD_REQUEST_ERROR');
  });
});
