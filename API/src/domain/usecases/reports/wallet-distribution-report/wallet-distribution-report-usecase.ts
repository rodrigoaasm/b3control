import { IWalletRepository } from '@domain-ports/repositories/wallet-repository-interface';
import { PositionEntity } from '@entities/position';
import { IReportInput } from '../report-interfaces';
import {
  IWalletDistributionUseCase,
  IWalletDistributionOutput,
  IAssetCurrentPosition,
  ICategoryCurrentPosition,
} from './wallet-distribution-report-interface';

export class WalletDistributionReportUseCase implements IWalletDistributionUseCase {
  constructor(private walletRepository: IWalletRepository) {

  }

  async get(filters: IReportInput): Promise<IWalletDistributionOutput> {
    const { userId } = filters;

    const assets: Array<IAssetCurrentPosition> = [];
    const categories = new Map<string, ICategoryCurrentPosition>();
    const currentPositions = await this.walletRepository.getUserCurrentPositions(userId);

    currentPositions.forEach((positionEntity: PositionEntity) => {
      assets.push({
        quantity: positionEntity.quantity,
        price: positionEntity.price,
        value: positionEntity.value,
        date: positionEntity.date,
        asset: positionEntity.asset,
      });

      if (categories.has(positionEntity.asset.category)) {
        const categoryPosition = categories.get(positionEntity.asset.category);
        categoryPosition.value += positionEntity.value;
      } else {
        categories.set(positionEntity.asset.category, {
          value: positionEntity.value,
          date: positionEntity.date,
          category: positionEntity.asset.category,
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
