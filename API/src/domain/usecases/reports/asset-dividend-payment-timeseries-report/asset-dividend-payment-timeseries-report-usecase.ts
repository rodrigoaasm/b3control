import { IDividendPaymentRepository } from '@domain-ports/repositories/dividend-payment-repository-interface';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { BadRequestError } from '@domain-error/custom-error';
import { IDateHandlerAdapter } from '@domain-ports/adapters/date-handler-adapter-interface';
import {
  IAssetCategoryReport, IAssetReport, ITimeSeriesReportOutput,
} from '../timeseries-report-interfaces';
import {
  IDividendPaymentsTimeSeriesReportUseCase,
  IDividendPaymentReport,
  IDividendPaymentsTimeSeriesReportInput,
} from './asset-dividend-payment-timeseries-report-interface';

export class DividendPaymentTimeSeriesReportUseCase
implements IDividendPaymentsTimeSeriesReportUseCase {
  constructor(
    private dividendPaymentRepository : IDividendPaymentRepository,
    private dateValidatorUtil: IDateValidatorAdapter,
    private dateHandlerUtil: IDateHandlerAdapter,
  ) {
  }

  public async get(
    filters: IDividendPaymentsTimeSeriesReportInput,
  ): Promise<ITimeSeriesReportOutput<IDividendPaymentReport>> {
    const { codes, beginMonth, endMonth } = filters;

    const today = new Date();
    const beginDate = beginMonth ? this.dateHandlerUtil.parse(beginMonth, 'yyyy-MM')
      : new Date(today.getFullYear(), today.getMonth(), 1);
    const parsedEndDate = endMonth ? this.dateHandlerUtil.parse(endMonth, 'yyyy-MM')
      : new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(parsedEndDate.getFullYear(), parsedEndDate.getMonth() + 1, 0);

    if (!this.dateValidatorUtil.isTimeInterval(beginDate, endDate)) {
      throw BadRequestError('The end date is greater than begin date.');
    }

    const result = await this.dividendPaymentRepository.getDividendPaymentsByMonth(
      codes, beginDate, endDate,
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
      assetPosition.items.push({
        date: monthlyValue.month,
        value: monthlyValue.value,
      });
    } else {
      assetTimeseries.set(monthlyValue.code, {
        name: monthlyValue.code,
        category: monthlyValue.category,
        items: [
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
      const currentItem = assetCategoryPosition.items
        .find((element: any) => element.date.getTime() === monthlyValue.month.getTime());

      if (currentItem) {
        currentItem.value += monthlyValue.value;
      } else {
        assetCategoryPosition.items.push({
          date: monthlyValue.month,
          value: monthlyValue.value,
        });
      }
    } else {
      categoryTimeseries.set(monthlyValue.category, {
        name: monthlyValue.category,
        items: [
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
