import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { PositionEntity } from '@entities/position/';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { BadRequestError } from '@domain-error/custom-error';
import {
  IAssetCategoryReport, IAssetReport, ITimeSeriesReportInput, ITimeSeriesReportOutput,
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

  private static calcProfitability(
    quantity: number, quote: number, averageBuyPrice: number,
  ): number {
    return quantity !== 0
      ? Number((((quote / averageBuyPrice) - 1) * 100).toFixed(3))
      : 0;
  }

  private static makePositionReportItem(position: PositionEntity): IPositionReport {
    return {
      date: position.date,
      price: position.price,
      quantity: position.quantity,
      value: position.value,
      averageBuyPrice: position.averageBuyPrice,
      profitability: AssetTimeSeriesReportUseCase
        .calcProfitability(position.quantity, position.price, position.averageBuyPrice),
    };
  }

  private static handleAssetTimelines(
    assetTimeseries: Map< string, IAssetReport<IPositionReport>>, position : PositionEntity,
  ): void {
    if (assetTimeseries.has(position.asset.code)) {
      const assetPosition = assetTimeseries.get(position.asset.code);
      assetPosition.items.push(AssetTimeSeriesReportUseCase.makePositionReportItem(position));
    } else {
      assetTimeseries.set(position.asset.code, {
        name: position.asset.code,
        category: position.asset.category,
        items: [
          AssetTimeSeriesReportUseCase.makePositionReportItem(position),
        ],
      });
    }
  }

  private static handleAssetCategoryTimeSeries(
    assetCategoryTimeSeries: Map< string, IAssetCategoryReport<IPositionReport>>,
    pos : PositionEntity,
  ): void {
    if (assetCategoryTimeSeries.has(pos.asset.category)) {
      const assetCategoryPosition = assetCategoryTimeSeries.get(pos.asset.category);
      const currentPos = assetCategoryPosition.items
        .find((element: IPositionReport) => element.date.getTime() === pos.date.getTime());

      if (currentPos) {
        // eslint-disable-next-line max-len
        const newQuote = (currentPos.value + pos.value) / (currentPos.quantity + pos.quantity);
        const investmentValue = (currentPos.averageBuyPrice) * (currentPos.quantity)
          + (pos.averageBuyPrice * pos.quantity);
        const newAverageBuyPrice = investmentValue / (currentPos.quantity + pos.quantity);
        currentPos.price = Number(newQuote.toFixed(3));
        currentPos.quantity += pos.quantity;
        currentPos.value += pos.value;
        currentPos.averageBuyPrice = Number(newAverageBuyPrice.toFixed(3));
        currentPos.profitability = AssetTimeSeriesReportUseCase
          .calcProfitability(currentPos.quantity, newQuote, newAverageBuyPrice);
      } else {
        assetCategoryPosition.items.push(
          AssetTimeSeriesReportUseCase.makePositionReportItem(pos),
        );
      }
    } else {
      assetCategoryTimeSeries.set(pos.asset.category, {
        name: pos.asset.category,
        items: [
          AssetTimeSeriesReportUseCase.makePositionReportItem(pos),
        ],
      });
    }
  }

  public async get(filters: ITimeSeriesReportInput)
    : Promise<ITimeSeriesReportOutput<IPositionReport>> {
    if (filters.begin && filters.end
      && !this.dateValidatorUtil.isTimeInterval(filters.begin, filters.end)) {
      throw BadRequestError('The begin date is greater than end date.');
    }

    const result = await this.positionRepository.getAssetTimeseries(
      filters.userId, filters.codes, filters.begin, filters.end,
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
