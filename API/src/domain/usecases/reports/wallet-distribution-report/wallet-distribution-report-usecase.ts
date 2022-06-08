/* eslint-disable no-underscore-dangle */
import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { PositionEntity } from '@entities/position';
import { IReportInput } from '../report-interfaces';
import {
  IWalletDistributionUseCase,
  IWalletDistributionOutput,
  IAssetCurrentPosition,
  ICategoryCurrentPosition,
} from './wallet-distribution-report-interface';

export class WalletDistributionReportUseCase implements IWalletDistributionUseCase {
  constructor(private walletRepository: IPositionRepository) {

  }

  async get(filters: IReportInput): Promise<IWalletDistributionOutput> {
    const { userId } = filters;

    const assets: Array<IAssetCurrentPosition> = [];
    const categories = new Map<string, ICategoryCurrentPosition>();
    const currentPositions = await this.walletRepository.getUserCurrentPositions(userId);

    currentPositions.forEach((positionEntity: PositionEntity) => {
      assets.push({
        _quantity: positionEntity.quantity,
        _price: positionEntity.price,
        _value: positionEntity.value,
        _date: positionEntity.date,
        _asset: positionEntity.asset,
      });

      if (categories.has(positionEntity.asset.category)) {
        const categoryPosition = categories.get(positionEntity.asset.category);
        categoryPosition._value += positionEntity.value;
      } else {
        categories.set(positionEntity.asset.category, {
          _value: positionEntity.value,
          _date: positionEntity.date,
          _category: positionEntity.asset.category,
        });
      }
    });

    return {
      assets,
      categories: Array.from(categories.values()),
    };
  }
}

export default WalletDistributionReportUseCase;
