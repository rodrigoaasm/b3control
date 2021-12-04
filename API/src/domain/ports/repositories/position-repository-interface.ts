import { PositionEntity } from '@entities/position/position-entity';

export interface IPositionRepository {
  getAssetTimeseries(codes: Array<string>, begin: Date | undefined,
    end : Date | undefined): Promise<Array<PositionEntity>>;
}
