import { PositionEntity } from '@entities/position/position-entity';

export interface IPositionRepository {
  getAssetTimeseries(userId: string, codes: Array<string>, begin: Date | undefined,
    end : Date | undefined): Promise<Array<PositionEntity>>;
  getUserCurrentPositions(userId: string): Promise<Array<PositionEntity>>;
  getUserCurrentPosition(userId: string, assetId: number): Promise<PositionEntity | undefined>;
  saveUserCurrentPosition(userCurrentPosition: PositionEntity): Promise<void>;
}
