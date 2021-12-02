import { IReportsRepository } from '@domain-ports/repositories/reports-repository-interface';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { BadRequestError } from '@domain-error/custom-error';
import { IReportInput } from '../report-interfaces';
import {
  IAssetCategoryReport, IAssetReport, ITimeSeriesReportOutput,
} from '../timeseries-report-interfaces';
import {
  IDividendPaymentsTimeSeriesReportUseCase, IDividendPaymentReport,
} from './asset-dividend-payment-timeseries-report-interface';

export class DividendPaymentTimeSeriesReportUseCase
implements IDividendPaymentsTimeSeriesReportUseCase {
  constructor(
    private reportsRepository : IReportsRepository,
    private dateValidatorUtil: IDateValidatorAdapter,
  ) {
  }

  public async get(
    filters: IReportInput,
  ): Promise<ITimeSeriesReportOutput<IDividendPaymentReport>> {
    if (filters.begin && filters.end
      && !this.dateValidatorUtil.isTimeInterval(filters.begin, filters.end)) {
      throw BadRequestError('The end date is greater than begin date.');
    }

    const result = await this.reportsRepository.getDividendPayments(
      filters.codes, filters.begin, filters.end,
    );

    const assetTimeseries = new Map< string, IAssetReport<IDividendPaymentReport>>();
    const categoryTimeseries = new Map< string, IAssetCategoryReport<IDividendPaymentReport>>();

    result.forEach((monthlyValue : any) => {
      DividendPaymentTimeSeriesReportUseCase
        .handleAssetDividendTimelines(assetTimeseries, monthlyValue);
      DividendPaymentTimeSeriesReportUseCase
        .handleCategoryDividendTimeSeries(categoryTimeseries, monthlyValue);
    });

    return {
      assets: Array.from(assetTimeseries.values()),
      categories: Array.from(categoryTimeseries.values()),
    };
  }

  private static handleAssetDividendTimelines(
    assetTimeseries: Map< string, IAssetReport<IDividendPaymentReport>>, monthlyValue : any,
  ): void {
    if (assetTimeseries.has(monthlyValue.code)) {
      const assetPosition = assetTimeseries.get(monthlyValue.code);
      assetPosition.itens.push({
        date: monthlyValue.month,
        value: monthlyValue.value,
      });
    } else {
      assetTimeseries.set(monthlyValue.code, {
        name: monthlyValue.code,
        category: monthlyValue.category,
        itens: [
          {
            date: monthlyValue.month,
            value: monthlyValue.value,
          },
        ],
      });
    }
  }

  private static handleCategoryDividendTimeSeries(
    categoryTimeseries: Map< string, IAssetCategoryReport<IDividendPaymentReport>>,
    monthlyValue : any,
  ): void {
    if (categoryTimeseries.has(monthlyValue.category)) {
      const assetCategoryPosition = categoryTimeseries.get(monthlyValue.category);
      const currentItem = assetCategoryPosition.itens
        .find((element: any) => element.date.getTime() === monthlyValue.month.getTime());

      if (currentItem) {
        currentItem.value += monthlyValue.value;
      } else {
        assetCategoryPosition.itens.push({
          date: monthlyValue.month,
          value: monthlyValue.value,
        });
      }
    } else {
      categoryTimeseries.set(monthlyValue.category, {
        name: monthlyValue.category,
        itens: [
          {
            date: monthlyValue.month,
            value: monthlyValue.value,
          },
        ],
      });
    }
  }
}

export default DividendPaymentTimeSeriesReportUseCase;
