import { PositionEntity } from '@entities/position/position-entity';

export interface IReportsRepository {
  getAssetTimeseries(codes: Array<string>, begin: Date | undefined,
    end : Date | undefined): Promise<Array<PositionEntity>>;

  getDividendPayments(codes: Array<string>, begin: Date | undefined,
    end: Date | undefined): Promise<Array<any>>;
}
