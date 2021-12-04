import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { PositionEntity } from '@entities/position/position-entity';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { BadRequestError } from '@domain-error/custom-error';
import { IReportInput } from '../report-interfaces';
import {
  IAssetCategoryReport, IAssetReport, ITimeSeriesReportOutput,
} from '../timeseries-report-interfaces';
import {
  IAssetTimeSeriesReportUseCase, IPositionReport,
} from './asset-timeseries-report-interface';

export class AssetTimeSeriesReportUseCase implements IAssetTimeSeriesReportUseCase {
  constructor(
    private positionRepository : IPositionRepository,
    private dateValidatorUtil: IDateValidatorAdapter,
  ) {
  }

  private static handleAssetTimelines(
    assetTimeseries: Map< string, IAssetReport<IPositionReport>>, position : PositionEntity,
  ): void {
    if (assetTimeseries.has(position.asset.code)) {
      const assetPosition = assetTimeseries.get(position.asset.code);
      assetPosition.itens.push({
        date: position.date,
        price: position.price,
        quantity: position.quantity,
        value: position.value,
      });
    } else {
      assetTimeseries.set(position.asset.code, {
        name: position.asset.code,
        category: position.asset.category,
        itens: [
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
    assetCategoryTimeSeries: Map< string, IAssetCategoryReport<IPositionReport>>,
    position : PositionEntity,
  ): void {
    if (assetCategoryTimeSeries.has(position.asset.category)) {
      const assetCategoryPosition = assetCategoryTimeSeries.get(position.asset.category);
      const currentPosition = assetCategoryPosition.itens
        .find((element: PositionEntity) => element.date.getTime() === position.date.getTime());

      if (currentPosition) {
        // eslint-disable-next-line max-len
        const newQuote = (currentPosition.value + position.value) / (currentPosition.quantity + position.quantity);
        currentPosition.price = Number(newQuote.toFixed(3));
        currentPosition.quantity += position.quantity;
        currentPosition.value += position.value;
      } else {
        assetCategoryPosition.itens.push({
          date: position.date,
          price: position.price,
          quantity: position.quantity,
          value: position.value,
        });
      }
    } else {
      assetCategoryTimeSeries.set(position.asset.category, {
        name: position.asset.category,
        itens: [
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

  public async get(filters: IReportInput): Promise<ITimeSeriesReportOutput<IPositionReport>> {
    if (filters.begin && filters.end
      && !this.dateValidatorUtil.isTimeInterval(filters.begin, filters.end)) {
      throw BadRequestError('The end date is greater than begin date.');
    }

    const result = await this.positionRepository.getAssetTimeseries(
      filters.codes, filters.begin, filters.end,
    );

    const assetTimeseries = new Map< string, IAssetReport<IPositionReport> >();
    const assetCategoryTimeSeries = new Map< string, IAssetCategoryReport<IPositionReport>>();

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
