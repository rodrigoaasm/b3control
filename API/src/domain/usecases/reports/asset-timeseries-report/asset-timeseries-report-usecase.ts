import { IReportsRepository } from '@domain-ports/repositories/reports-repository-interface';
import { PositionEntity } from '@entities/position/position-entity';
import {
  IAssetTimeSeriesReportUseCase, IAssetTimeSeriesReportOutput, IAssetReport, IAssetCategoryReport,
} from './asset-timeseries-report-interface';
import { IReportInput } from '../report-interfaces';

export class AssetTimeSeriesReportUseCase implements IAssetTimeSeriesReportUseCase {
  constructor(
    private reportsRepository : IReportsRepository,
  ) {
  }

  private static handleAssetTimelines(
    assetTimeseries: Map< string, IAssetReport>, position : PositionEntity,
  ): void {
    if (assetTimeseries.has(position.asset.code)) {
      const assetPosition = assetTimeseries.get(position.asset.code);
      assetPosition.positions.push({
        date: position.date,
        price: position.price,
        quantity: position.quantity,
        value: position.value,
      });
    } else {
      assetTimeseries.set(position.asset.code, {
        name: position.asset.code,
        category: position.asset.category,
        positions: [
          {
            date: position.date,
            price: position.price,
            quantity: position.quantity,
            value: position.value,
          },
        ],
      });
    }
  }

  private static handleAssetCategoryTimeSeries(
    assetCategoryTimeSeries: Map< string, IAssetCategoryReport>, position : PositionEntity,
  ): void {
    if (assetCategoryTimeSeries.has(position.asset.category)) {
      const assetCategoryPosition = assetCategoryTimeSeries.get(position.asset.category);
      const currentPosition = assetCategoryPosition.positions
        .find((element: PositionEntity) => element.date.getTime() === position.date.getTime());

      if (currentPosition) {
        // eslint-disable-next-line max-len
        const newQuote = (currentPosition.value + position.value) / (currentPosition.quantity + position.quantity);
        currentPosition.price = Number(newQuote.toFixed(3));
        currentPosition.quantity += position.quantity;
        currentPosition.value += position.value;
      } else {
        assetCategoryPosition.positions.push({
          date: position.date,
          price: position.price,
          quantity: position.quantity,
          value: position.value,
        });
      }
    } else {
      assetCategoryTimeSeries.set(position.asset.category, {
        name: position.asset.category,
        positions: [
          {
            date: position.date,
            price: position.price,
            quantity: position.quantity,
            value: position.value,
          },
        ],
      });
    }
  }

  public async get(filters: IReportInput): Promise<IAssetTimeSeriesReportOutput> {
    const result = await this.reportsRepository.getAssetTimeseries(
      filters.codes, filters.begin, filters.end,
    );

    const assetTimeseries = new Map< string, IAssetReport>();
    const assetCategoryTimeSeries = new Map< string, IAssetCategoryReport>();

    result.forEach((position : PositionEntity) => {
      AssetTimeSeriesReportUseCase.handleAssetTimelines(assetTimeseries, position);
      AssetTimeSeriesReportUseCase.handleAssetCategoryTimeSeries(assetCategoryTimeSeries, position);
    });

    return {
      assets: Array.from(assetTimeseries.values()),
      categories: Array.from(assetCategoryTimeSeries.values()),
    };
  }
}

export default AssetTimeSeriesReportUseCase;
