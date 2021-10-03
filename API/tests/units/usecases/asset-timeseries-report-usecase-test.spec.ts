import { AssetTimeSeriesReportUseCase } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-usecase';
import { ReportRepositoryMock } from '@test-mocks/report-repository-mock';
import { IReportInput } from '@usecases/reports/report-interfaces';
import { IAssetReport, IAssetTimeSeriesReportOutput } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-interface';

describe('Asset Timeseries Report UseCase', () => {
  let assetTimeseriesReportUsecase: AssetTimeSeriesReportUseCase;

  beforeEach(() => {
    assetTimeseriesReportUsecase = new AssetTimeSeriesReportUseCase(new ReportRepositoryMock());
  });

  it('Should return formatted data, when repository returns data', async () => {
    const filter: IReportInput = {
      codes: undefined,
      begin: undefined,
      end: undefined,
    };

    const test11 = {
      name: 'TEST11',
      category: 'stock',
      positions: [
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
    } as IAssetReport;

    const test4 = {
      name: 'TEST4',
      category: 'stock',
      positions: [
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
    } as IAssetReport;

    const test3 = {
      name: 'TEST3',
      category: 'general',
      positions: [
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
    } as IAssetReport;

    const stockCategory = {
      name: 'stock',
      positions: [
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

    const generalCategory = {
      name: 'general',
      positions: [
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
    const output = await assetTimeseriesReportUsecase.get(filter);

    expect(output).toEqual({
      assets: [],
      categories: [],
    } as IAssetTimeSeriesReportOutput);
  });
});
