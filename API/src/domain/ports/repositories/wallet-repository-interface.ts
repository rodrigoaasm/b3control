import { PositionEntity } from '@entities/position';

export interface IWalletRepository {
  getUserCurrentPositions(userId: string): Promise<Array<PositionEntity>>;
}
