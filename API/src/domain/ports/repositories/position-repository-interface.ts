import { PositionEntity, UserPositionEntity } from '@entities/position';

export interface IPositionRepository {
  getAssetTimeseries(userId: string, codes: Array<string>, begin: Date | undefined,
    end : Date | undefined): Promise<Array<PositionEntity>>;
  getUserCurrentPositions(userId: string): Promise<Array<PositionEntity>>;
  getUserCurrentPosition(userId: string, assetId: number): Promise<UserPositionEntity | undefined>;
  saveUserCurrentPosition(userCurrentPosition: UserPositionEntity): Promise<void>;
}
